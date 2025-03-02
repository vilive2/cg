const fileInput = document.getElementById("plyFile");
const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

const phi = document.getElementById("phi");
const theta = document.getElementById("theta");
const r = document.getElementById("r");
const scale = document.getElementById("scale");
const tx = document.getElementById("tx");
const ty = document.getElementById("ty");

const phival = document.getElementById("phival");
const thetaval = document.getElementById("thetaval");
const rval = document.getElementById("rval");
const scaleval = document.getElementById("scaleval");
const txval = document.getElementById("txval");
const tyval = document.getElementById("tyval");

fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    readPLYFile(file);
})

phi.addEventListener("input", () => {
    phival.textContent = phi.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
theta.addEventListener("input", () => {
    thetaval.textContent = theta.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
r.addEventListener("input", () => {
    rval.textContent = r.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
scale.addEventListener("input", () => {
    scaleval.textContent = scale.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
tx.addEventListener("input", () => {
    txval.textContent = tx.value;
    render();
});
ty.addEventListener("input", () => {
    tyval.textContent = ty.value;
    render();
});


let vertices = [];
let faces = [];
let viewerLocation = [0, 0, 100000];
let S = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let M1 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let T = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [100, 600, 0, 1]];
let v2d = [];

resetCanvas();

function readPLYFile(plyFile) {
  if (!plyFile) return;
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const content = e.target.result;
    parsePLY(content);
  };
  
  reader.readAsText(plyFile);
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    // ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    // ctx.fillText('3D Viewer Canvas', 10, 20);
    ctx.fillText('O(0,0)', 0, canvas.height-2);
    for(let x = 50 ; x < canvas.width ; x += 50) {
        ctx.fillText('|', x, canvas.height);
        ctx.fillText('_', 0, x);
    }

    ctx.fillText('X', canvas.width-15, canvas.height-2);
    ctx.fillText('Y', 0, 15);
}

function render() {
    if(vertices.length == 0) return;
    updatePoints();

    resetCanvas();
    plotVertices();
    plotFaces();
}

function updatePoints() {
    viewerLocation = sphericalToCartesian(theta.value, phi.value, r.value);

    S[0][0] = scale.value;
    S[1][1] = scale.value;
    S[2][2] = scale.value;

    M1[0][0] = viewerLocation[2];
    M1[1][1] = viewerLocation[2];
    M1[2][0] = viewerLocation[0];
    M1[2][1] = viewerLocation[1];

    T[3][0] = 1*tx.value;
    T[3][1] = canvas.height - 1*ty.value;

    // v2d = dotProduct(vertices, S);
    // v2d = dotProduct(v2d, M1);
    v2d = dotProduct(vertices, M1);
    v2d = dotProduct(v2d, S);
    for(let i = 0 ; i < vertices.length ; i++) {
        v2d[i][0] = Math.trunc(v2d[i][0] / (v2d[i][2] + viewerLocation[2]));
        v2d[i][1] = Math.trunc(v2d[i][1] / (v2d[i][2] + viewerLocation[2]));
    }

    v2d = dotProduct(v2d, T);
}

function parsePLY(content) {
    const lines = content.split('\n');
    let isHeader = true;
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip empty lines or comments
        if (line.startsWith('ply') || line.startsWith('comment') || line.length === 0) {
        continue;
        }
        
        // Parse header (skip if isHeader is true)
        if (isHeader) {
        if (line.startsWith('end_header')) {
            isHeader = false;
        }
        continue;
        }
        
        // Parse faces
        if (line.match(/^(\d+\s+){3,}\d+$/)) { // Pattern for faces (list of vertex indices)
            const face = line.split(' ').map(Number);
            faces.push(face.slice(1)); // First number is the count of vertices
        } else {// Parse vertices
            const vertex = line.split(' ').map(Number).slice(0,3);
            vertex.push(1);
            vertices.push(vertex);
        }
    }

    try {
        render();
    } catch(error) {
        console.log(error);
    }
}

function plotVertices() {
    for(let i = 0 ; i < v2d.length ; i++) {
        ctx.fillRect(v2d[i][0], v2d[i][1], 1, 1);
        // console.log(v2d[i][0], v2d[i][1]);
    }
}

function plotFaces() {
    console.log("Faces");
    for(let i = 0 ; i < faces.length ; i++) {
        for(let j = 0 ; j < faces[i].length ; j++) {
            k = (j + 1) % faces[i].length;
            try {
                plotLineXY(v2d[faces[i][j]], v2d[faces[i][k]]);
            } catch(error) {
                console.log("An error occurred:", error.message);
            }
        }
    }
}

function plotLineXY(v1, v2) {
    bresenhamLine(Math.trunc(v1[0]), Math.trunc(v1[1]), Math.trunc(v2[0]), Math.trunc(v2[1]));
}

function bresenhamLine(x1, y1, x2, y2) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        ctx.fillRect(x1, y1, 1, 1);  // Draw pixel

        if (x1 === x2 && y1 === y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
}

function dotProduct(A, B) {
    let rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length;

    if (colsA !== rowsB) {
        throw new Error("Invalid dimensions for matrix multiplication");
    }

    let result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Function to convert Spherical Coordinates to 3D Cartesian Coordinates
function sphericalToCartesian(thetaDeg, phiDeg, radius) {
    const theta = degToRad(thetaDeg); // Convert to radians
    const phi = degToRad(phiDeg);     // Convert to radians

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return [ x, y, z ];
}