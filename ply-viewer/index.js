let viewerLocation = [0, 0, 100000];
let cop = new Vector(0, 0, 10000);
let S = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let M1 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let T = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [100, 600, 0, 1]];
let v2d = [];

let scaleby = 1000;

const illum = new Illumination(0.1, 0.7, 0.7, [196, 29, 118], [186, 194, 29], [189, 32, 37], 620);
const lightVec = new Vector(1900, 1600, 0);
const borderColor = [0, 0, 0];
const faceColor = [6, 84, 209];
let trianles = [];
let verticesVectors = [];

const plyParser = new PlyParser();

resetCanvas();

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
    if(plyParser.vertices.length == 0) return;
    updatePoints();

    resetCanvas();
    // fillFaces();
    fillFacesWithShading();
}

function bringToCenter() {
    v2d = dotProduct(plyParser.vertices, S);
    
    v2d = dotProduct(v2d, M1);
    for(let i = 0 ; i < v2d.length ; i++) {
        v2d[i][0] = Math.trunc(v2d[i][0] / (v2d[i][2] + viewerLocation[2]));
        v2d[i][1] = Math.trunc(v2d[i][1] / (v2d[i][2] + viewerLocation[2]));
    }

    let xmx = -1000000;
    let xmn = 10000000;
    let ymx = -10000000;
    let ymn = 100000000;

    for(let i = 0 ; i < v2d.length ; i++) {
        xmx = Math.max(xmx, v2d[i][0]);
        xmn = Math.min(xmn, v2d[i][0]);
        ymx = Math.max(ymx, v2d[i][1]);
        ymn = Math.min(ymn, v2d[i][1]);
    }

    let cx = Math.trunc((xmn+xmx) / 2);
    let cy = Math.trunc((ymn+ymx) / 2);

    let tx = (canvas.width / 2) - cx;
    let ty = (canvas.height / 2) + cy;
    T[3][0] = tx;
    T[3][1] = ty;
}

function updatePoints() {
    illum.Ia = ia.value;
    illum.Ip = id.value;
    illum.Is = is.value;
    illum.alpha = alpha.value;
    illum.Ka = hexToRgb(ka.value);
    illum.Kp = hexToRgb(kd.value);
    illum.Ks = hexToRgb(ks.value);

    viewerLocation = sphericalToCartesian(theta.value, phi.value, r.value);
    vloc.textContent = `(${viewerLocation[0]}, ${viewerLocation[1]}, ${viewerLocation[2]})`;
    cop = new Vector(viewerLocation[0], viewerLocation[1], viewerLocation[2]);

    S[0][0] = scaleby;
    S[1][1] = scaleby;
    S[2][2] = scaleby;

    M1[0][0] = viewerLocation[2];
    M1[1][1] = viewerLocation[2];
    M1[2][0] = viewerLocation[0];
    M1[2][1] = viewerLocation[1];

    bringToCenter();
    // T[3][0] = 1*tx.value;
    // T[3][1] = canvas.height - 1*ty.value;

    v2d = dotProduct(plyParser.vertices, S);
    v2d = dotProduct(v2d, T);

    verticesVectors = [];
    for(const vertex of v2d) {
        verticesVectors.push(new Vector(vertex[0], vertex[1], vertex[2]));
    }

    trianles = [];
    for(const face of plyParser.faces) {
        trianles.push(new Triangle(verticesVectors[face[0]], verticesVectors[face[1]], verticesVectors[face[2]], [255, 0, 0]));
    }

    v2d = dotProduct(v2d, M1);
    for(let i = 0 ; i < v2d.length ; i++) {
        v2d[i][0] = Math.trunc(v2d[i][0] / (v2d[i][2] + viewerLocation[2]));
        v2d[i][1] = Math.trunc(v2d[i][1] / (v2d[i][2] + viewerLocation[2]));
    }
}

function fillFaces() {
    for(const face of plyParser.faces) {
        fillTriangle(v2d[face[0]], v2d[face[1]], v2d[face[2]], faceColor, borderColor);
    }
}

function fillFacesWithShading() {
    for(let i = 0 ; i < trianles.length ; i++) {
        const normal = trianles[i].normal();
        const viewDir = cop.sub(trianles[i].P);
        const lightDir = lightVec.sub(trianles[i].P);
        const face = plyParser.faces[i];
        if(normal.dot(viewDir) < 0) {
            fillTriangle(
                v2d[face[0]],
                v2d[face[1]],
                v2d[face[2]],
                illum.shading(trianles[i].P, normal, lightDir, viewDir),
                borderColor
            );
        }

        // fillTriangle(
        //     v2d[face[0]],
        //     v2d[face[1]],
        //     v2d[face[2]],
        //     // faceColor,
        //     illum.shading(trianles[i].P, normal, lightDir, viewDir),
        //     borderColor
        // );
    }
}