function bresenhamLine(P, Q) {
    let x1 = P[0];
    let x2 = Q[0];
    let y1 = P[1];
    let y2 = Q[1];
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        ctx.fillRect(x1, y1, 1, 1); 

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

function bresenhamLineBuf(P, Q, buf) {
    let x1 = P[0];
    let x2 = Q[0];
    let y1 = P[1];
    let y2 = Q[1];
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {

        buf[x1][y1] = 1;
        
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

function drawTriangle(P, Q, R) {
    bresenhamLine(P, Q);
    bresenhamLine(P, R);
    bresenhamLine(Q, R);
}