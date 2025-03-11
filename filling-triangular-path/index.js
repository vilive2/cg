const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const vertices = [[500, 190], [580, 120], [240, 555]];

ctx.fillStyle = "white";

fillTriangle(vertices);

function fillTriangle(vertices) {
    const xmx = Math.max(vertices[0][0], vertices[1][0], vertices[2][0]);
    const xmn = Math.min(vertices[0][0], vertices[1][0], vertices[2][0]);
    const ymx = Math.max(vertices[0][1], vertices[1][1], vertices[2][1]);
    const ymn = Math.min(vertices[0][1], vertices[1][1], vertices[2][1]);
    
    const buf = Array.from({ length: xmx - xmn+1 }, () => [ymx - ymn+1, -1]);

    bresenhamLineFillBuf(vertices[0][0]-xmn, vertices[0][1]-ymn, vertices[1][0]-xmn, vertices[1][1]-ymn, buf);
    bresenhamLineFillBuf(vertices[1][0]-xmn, vertices[1][1]-ymn, vertices[2][0]-xmn, vertices[2][1]-ymn, buf);
    bresenhamLineFillBuf(vertices[0][0]-xmn, vertices[0][1]-ymn, vertices[2][0]-xmn, vertices[2][1]-ymn, buf);

    for(let i = 0 ; i < buf.length ; i++) {
        if(buf[i][0] <= buf[i][1]) {
            ctx.fillStyle = "white";
            ctx.fillRect(i+xmn, buf[i][0]+ymn, 1, 1);
            ctx.fillRect(i+xmn, buf[i][1]+ymn, 1, 1);
        }
        ctx.fillStyle = "blue";
        for(let j = buf[i][0]+1 ; j < buf[i][1] ; j++) {
            ctx.fillRect(i+xmn, j+ymn, 1, 1);
        }
    }

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