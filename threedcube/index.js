const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const vertices = [
    [0, 0, 0],
    [0, 0, 100],
    [0, 100, 0],
    [0, 100, 100],
    [100, 0, 0],
    [100, 0, 100],
    [100, 100, 0],
    [100, 100, 100]
];
let v2d = [];
let vx = 200, vy = 200, vz = 500;

const faces = [
    [0, 4, 6, 2], 
    [6, 4, 5, 7],
    [2, 3, 7, 6],
    [0, 1, 3, 2],
    [0, 1, 5, 4],
    [3, 1, 5, 7]
]

const edges = [
    [0, 1],
    [0, 2],
    [0, 4],
    [1, 3],
    [1, 5],
    [2, 3],
    [2, 6],
    [3, 7],
    [4, 5],
    [4, 6],
    [5, 7],
    [6, 7]
];


function fillFace(quad) {
    const xmx = Math.max(quad[0][0], quad[1][0], quad[2][0], quad[3][0]);
    const xmn = Math.min(quad[0][0], quad[1][0], quad[2][0], quad[3][0]);
    const ymx = Math.max(quad[0][1], quad[1][1], quad[2][1], quad[3][1]);
    const ymn = Math.min(quad[0][1], quad[1][1], quad[2][1], quad[3][1]);
    
    const buf = Array.from({ length: xmx - xmn+1 }, () => [ymx - ymn+1, -1]);

    bresenhamLineFillBuf(quad[0][0]-xmn, quad[0][1]-ymn, quad[1][0]-xmn, quad[1][1]-ymn, buf);
    bresenhamLineFillBuf(quad[1][0]-xmn, quad[1][1]-ymn, quad[2][0]-xmn, quad[2][1]-ymn, buf);
    bresenhamLineFillBuf(quad[2][0]-xmn, quad[2][1]-ymn, quad[3][0]-xmn, quad[3][1]-ymn, buf);
    bresenhamLineFillBuf(quad[3][0]-xmn, quad[3][1]-ymn, quad[0][0]-xmn, quad[0][1]-ymn, buf);

    for(let i = 0 ; i < buf.length ; i++) {
        if(buf[i][0] <= buf[i][1]) {
            ctx.fillStyle = "black";
            ctx.fillRect(i+xmn, buf[i][0]+ymn, 1, 1);
            ctx.fillRect(i+xmn, buf[i][1]+ymn, 1, 1);
        }
        ctx.fillStyle = "blue";
        for(let j = buf[i][0]+1 ; j < buf[i][1] ; j++) {
            ctx.fillRect(i+xmn, j+ymn, 1, 1);
        }
    }
}

function drawFace(quad) {
    ctx.fillStyle = "black";
    for(let i = 0 ; i < 4 ; i++)
        bresenhamLine(quad[i][0], quad[i][1], quad[(i+1)%4][0], quad[(i+1)%4][1]);
}

function fillCube() {
    for(let i = 0 ; i < 8 ; i++) {
        let v1 = vertices[i];
        
        let x1 = Math.trunc((vx * v1[2] + v1[0] * vz) / (vz + v1[2]));
        let y1 = Math.trunc((vy * v1[2] + v1[1] * vz) / (vz + v1[2]));
        v2d.push([x1, y1]);
    }
    
    // for(let i = 0 ; i < 6 ; i++) {
    //     let quad = []
    //     for(let j = 0 ; j < 4 ; j++) {
    //         quad.push(v2d[faces[i][j]]);
    //     }

    //     fillFace(quad);
    // }

    let i = 0;
    setInterval(function () {
        if ( i < 6 ) {
            let quad = []
            for(let j = 0 ; j < 4 ; j++) {
                quad.push(v2d[faces[i][j]]);
            }

            fillFace(quad);
            drawFace(quad);
            i += 1;
        }
    }, 2000);
}

function bresenhamLineFillBuf(x1, y1, x2, y2, buf) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {

        buf[x1][0] = Math.min(buf[x1][0], y1);
        buf[x1][1] = Math.max(buf[x1][1], y1);
        
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

function drawCube(vx, vy, vz) {

    for(let i = 0 ; i < 6 ; i++) {
        for(let j = 0 ; j < 4 ; j++) {
            let v1 = vertices[faces[i][j]];
            let v2 = vertices[faces[i][(j+1)%4]];
    
            let x1 = Math.trunc((vx * v1[2] + v1[0] * vz) / (vz + v1[2]));
            let y1 = Math.trunc((vy * v1[2] + v1[1] * vz) / (vz + v1[2]));
    
            let x2 = Math.trunc((vx * v2[2] + v2[0] * vz) / (vz + v2[2]));
            let y2 = Math.trunc((vy * v2[2] + v2[1] * vz) / (vz + v2[2]));
    
            // {{/* console.log([x1, y1], [x2, y2]); */}}
            bresenhamLine(x1, y1, x2, y2);
        }
    }
}

function bresenhamLine(x1, y1, x2, y2) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

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


fillCube();
// drawCube(vx, vy, vz);

// setInterval(function () {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawCube(vx, vy, vz);
//     vz = 50 + ((vz + 50) % 500);
// }, 1000);

/*
for(let vz = 100 ; vz < 5000 ; vz+=50) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    {{/* drawCube(viewer[i][0], viewer[i][1], viewer[i][2]); 
    drawCube(vx, vy, vz);
}*/
// {{/* drawCube(200, 200, 300); */}}