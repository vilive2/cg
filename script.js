window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
let viewerLocation = [0, 0, 100000];
let cop = new Vector(0, 0, 10000);
let R = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let S = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let M1 = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
let T = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [100, 600, 0, 1]];
let v2d = [];
let vertices = [];

let scaleby = 3000;

const illum = new Illumination(0.1, 0.7, 0.7, [196, 29, 118], [186, 194, 29], [189, 32, 37], 620);
let lightVec = new Vector(1900, 1600, 0);
let lightLocation = [0, 0, 100000];
const borderColor = [0, 0, 0];
const faceColor = [6, 84, 209];
let trianles = [];
let verticesVectors = [];

const plyParser = new PlyParser();

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    // ctx.fillText('3D Viewer Canvas', 10, 20);
    ctx.fillText('O(0,0)', 0, canvas.height-2);
    for(let x = 50 ; x < canvas.width ; x += 50) {
        ctx.fillText('|', x, canvas.height);
    }
    
    for(let y = 50 ; y < canvas.height ; y += 50) {
        ctx.fillText('_', 0, canvas.height - y);
    }

    ctx.fillText('X', canvas.width-15, canvas.height-2);
    ctx.fillText('Y', 0, 15);

    // console.log("box draw begin");
    // drawBox();
    // console.log("box drawn");
}

function render() {
    resetCanvas();
    
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

    lightLocation = sphericalToCartesian(ltheta.value, lphi.value, lr.value)
    lloc.textContent = `(${lightLocation[0]}, ${lightLocation[1]}, ${lightLocation[2]})`;
    lightVec = new Vector(lightLocation[0], lightLocation[1], lightLocation[2]);

    if(plyParser.vertices.length == 0) return;
    updatePoints();

    // fillFaces();
    // zBuffer.fill(Infinity);
    fillFacesWithShading();
}

function bringToCenter() {
    v2d = dotProduct(plyParser.vertices, S);
    v2d = dotProduct(v2d, R);
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

    const rotangx = degToRad(rotx.value);
    const rotangy = degToRad(roty.value);
    const rotangz = degToRad(rotz.value);
    R[1][2] = -Math.sin(rotangx);
    R[2][1] = Math.sin(rotangx);
    
    R[0][2] = -Math.sin(rotangy);
    R[2][0] = Math.sin(rotangy);
    
    R[0][1] = -Math.sin(rotangz);
    R[1][0] = Math.sin(rotangz);
    
    R[2][2] = Math.cos(rotangx) * Math.cos(rotangy);
    R[0][0] = Math.cos(rotangy) * Math.cos(rotangz);
    R[1][1] = Math.cos(rotangx) * Math.cos(rotangz);


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
    v2d = dotProduct(v2d, R);
    v2d = dotProduct(v2d, T);

    vertices = v2d;
    verticesVectors = [];
    for(const vertex of v2d) {
        verticesVectors.push(new Vector(vertex[0], vertex[1], vertex[2]));
    }

    trianles = [];
    for(const face of plyParser.faces) {
        trianles.push(new Triangle(verticesVectors[face[0]], verticesVectors[face[1]], verticesVectors[face[2]], [0,0,0]));
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
    // console.log("starting z buffer");
    // let zbuf = Array(canvas.width * canvas.height).fill(Infinity);
    // let framebuf = Array(canvas.width * canvas.height).fill([0, 0, 0]);
    // const imageData = ctx.createImageData(canvas.width, canvas.height);
    
    for(let i = 0 ; i < trianles.length ; i++) {
        const normal = trianles[i].normal();
        const viewDir = cop.sub(trianles[i].P);
        const lightDir = lightVec.sub(trianles[i].P);
        trianles[i].color = illum.shading(trianles[i].P, normal, lightDir, viewDir);
    }

    console.log("ray trace start");
    rayTrace(ctx, cop, trianles);
    console.log("ray trace end");

    for(let i = 0 ; i < trianles.length ; i++) {
        // const normal = trianles[i].normal();
        // const viewDir = cop.sub(trianles[i].P);
        // const lightDir = lightVec.sub(trianles[i].P);
        // const face = plyParser.faces[i];
        // if(normal.dot(viewDir) < 0) {
        //     fillTriangle(
        //         v2d[face[0]],
        //         v2d[face[1]],
        //         v2d[face[2]],
        //         illum.shading(trianles[i].P, normal, lightDir, viewDir),
        //         borderColor
        //     );
        // }

        // Z Buffer
        // fillTriangleZ(v2d[face[0]],v2d[face[1]],v2d[face[2]], 
        //     illum.shading(trianles[i].P, normal, lightDir, viewDir), borderColor, 
        //     vertices[face[0]][2], vertices[face[1]][2], vertices[face[2]][2], zbuf, imageData.data);

        // ctx.fillStyle = "white";
        // drawTriangleZ(vertices[face[0]], vertices[face[1]], vertices[face[2]],
        //     v2d[face[0]], 
        //     v2d[face[1]], 
        //     v2d[face[2]]);

        // fillTriangle(
        //     v2d[face[0]],
        //     v2d[face[1]],
        //     v2d[face[2]],
        //     // faceColor,
        //     illum.shading(trianles[i].P, normal, lightDir, viewDir),
        //     borderColor
        // );
    }

    // for(let x = 0 ; x < canvas.width ; x++) {
    //     for(let y = 0 ; y < canvas.height ; y++) {
    //         const index = y * canvas.width + x;
    //         ctx.fillStyle = `rgb(${framebuf[index][0]}, ${framebuf[index][1]}, ${framebuf[index][2]})`;
    //         ctx.fillRect(x, y, 1, 1);
    //     }
    // }
    // ctx.putImageData(imageData, 0, 0);

    // console.log("finished");
}

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // Set actual rendering size for high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    render();
    // resetCanvas();
    // Optional: Update WebGL or redraw if needed
    // renderer.setSize(canvas.width, canvas.height);
}

function drawBox() {
    const w = canvas.width;
    const h = canvas.height;

    const cubeVertices = [
        [0,0,0,1],
        [w,0,0,1],
        [w,h,0,1],
        [0,h,0,1],
        [0,0,w,1],
        [w,0,w,1],
        [w,h,w,1],
        [0,h,w,1],
    ];

    const cubeFaces = [
        [0,1,5],
        [0,5,4],
        [1,2,5],
        [2,5,6],
        [2,6,7],
        [2,3,7],
        [0,3,7],
        [0,4,7],
        [4,6,7],
        [4,5,6]
    ];

    const edges = [
        [3, 7],
        [2, 6],
        [0, 4],
        [1, 5],
        [6, 7],
        [5, 6],
        [4, 5],
        [4, 7]
    ];

    let cubeProj = dotProduct(cubeVertices, M1);
    for(let i = 0 ; i < cubeProj.length ; i++) {
        cubeProj[i][0] = Math.trunc(cubeProj[i][0] / (cubeProj[i][2] + viewerLocation[2]));
        cubeProj[i][1] = Math.trunc(cubeProj[i][1] / (cubeProj[i][2] + viewerLocation[2]));
    }

    // console.log('painting wall');
    // for(let i = 0 ; i < cubeFaces.length ; i++) {
    //     fillTriangle(
    //         cubeProj[cubeFaces[i][0]],
    //         cubeProj[cubeFaces[i][1]],
    //         cubeProj[cubeFaces[i][2]],
    //         [197,194,199],
    //         borderColor
    //     );
    // }
    // console.log('finished');

    ctx.fillStyle = "red";
    for(let i = 0 ; i < edges.length ; i++) {
        bresenhamLine(cubeProj[edges[i][0]], cubeProj[edges[i][1]]);
        console.log(cubeVertices[edges[i][0]], cubeVertices[edges[i][1]]);
    }

}