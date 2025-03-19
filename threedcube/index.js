const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#615b4b";
ctx.fillRect(0, 0, canvas.height, canvas.width);

const vertices = [
    [0, 0, 0,],
    [100, 0, 0,],
    [100, 0, 100,],
    [100, 100, 100,],
    [0, 100, 100,],
    [0, 100, 0,],
    [0, 0, 100,],
    [100, 100, 0,]
];

let verticesVectors = []

let v2d = [];
let vx = 500, vy = 500, vz = -500;
const cop = new Vector(vx, vy, vz);

const faces = [
    [0, 1, 5],
    [1, 7, 5],
    [3, 6, 4],
    [2, 6, 3],
    [1, 2, 3],
    [1, 3, 7],
    [0, 5, 4],
    [0, 4, 6],
    [4, 5, 7],
    [3, 4, 7],
    [0, 6, 1],
    [1, 6, 2]
]

let trianles = [];

const light = {
    position: new Vector(1000, 5000, 50000),
    intensity: 1.0,
};

const ambientIntensity = 0.2;
const diffuseIntensity = 0.7;
const specularIntensity = 0.9;
const shininess = 32;

const borderColor = [0, 0, 0];
const faceColor = [6, 84, 209];

const illum = new Illumination(0.1, 0.7, 0.9, [196, 29, 118], [196, 194, 29], [255, 255, 255], 10000);

function drawCube() {
    ctx.fillStyle = "black";
    let i = 0;
    setInterval(function () {
        if ( i < 12 ) {
            drawTriangle(v2d[faces[i][0]], v2d[faces[i][1]], v2d[faces[i][2]])
            i += 1;
        }
    }, 2000);
}

function fillCube() {
    let i = 0;
    setInterval(function () {
        if ( i < 12 ) {
            const normal = trianles[i].normal();
            const viewDirection = cop.sub(trianles[i].P);
            const lightDir = light.position.sub(trianles[i].P);
            if(normal.dot(viewDirection) < 0)
                fillTriangle(
                    v2d[faces[i][0]], 
                    v2d[faces[i][1]], 
                    v2d[faces[i][2]], 
                    illum.shading(trianles[i].P, normal, lightDir, viewDirection), 
                    borderColor
                );
            i += 1;
        }
    }, 1000);
}

for(let i = 0 ; i < 8 ; i++) {
    vertices[i] = plus(vertices[i], [100, 100, 0]);
    verticesVectors.push(new Vector(vertices[i][0], vertices[i][1], vertices[i][2]));
}

for(let i = 0 ; i < 8 ; i++) {
    let v1 = vertices[i];
    
    let x1 = Math.trunc((vx * v1[2] + v1[0] * vz) / (vz + v1[2]));
    let y1 = Math.trunc((vy * v1[2] + v1[1] * vz) / (vz + v1[2]));
    v2d.push([x1, canvas.height - y1]);
}
planeCoeff = []
for(let i = 0 ; i < faces.length ; i++) {
    planeCoeff.push(planeEquationCoeff(vertices[faces[i][0]], vertices[faces[i][1]], vertices[faces[i][2]]));
}

for(let i = 0 ; i < faces.length ; i++) {
    trianles.push(new Triangle(
        verticesVectors[faces[i][0]],
        verticesVectors[faces[i][1]],
        verticesVectors[faces[i][2]],
        [255, 0, 0]
    ));
}

width = canvas.width;
height = canvas.height;

function visibleSurfaceOnly() {
    for(let x = 0 ; x < width ; x++) {
        for(let y = 0 ; y < height ; y++) {
            rayTrace([vx, vy, vz], [x, y, 0], planeCoeff, vertices);   
        }
    }
}


// drawCube();
fillCube();
// zbuffer();
// visibleSurfaceOnly();