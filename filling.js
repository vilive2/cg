function fillTriangle(P, Q, R, faceColor, borderColor) {
    const xmx = Math.max(P[0], Q[0], R[0]);
    const xmn = Math.min(P[0], Q[0], R[0]);
    const ymx = Math.max(P[1], Q[1], R[1]);
    const ymn = Math.min(P[1], Q[1], R[1]);
    
    const w = xmx - xmn + 1;
    const h = ymx - ymn + 1;

    const buf = Array.from({ length: w }, () => new Array(h).fill(0));
    P[0] -= xmn;
    P[1] -= ymn;
    Q[0] -= xmn;
    Q[1] -= ymn;
    R[0] -= xmn;
    R[1] -= ymn;
    
    bresenhamLineBuf(P, Q, buf);
    bresenhamLineBuf(P, R, buf);
    bresenhamLineBuf(Q, R, buf);

    for(let i = 0 ; i < buf.length ; i++) {
        let l = ymx+1;
        let r = -1;
        for(let j = 0 ; j < buf[0].length ; j++) {
            if(buf[i][j] == 1) {
                l = Math.min(l, j);
                r = Math.max(r, j);
            }
        }
        ctx.fillStyle = `rgb(${faceColor[0]}, ${faceColor[1]}, ${faceColor[2]})`;
        for(let j = l ; j <= r ; j++) {
            ctx.fillRect(i+xmn, j+ymn, 1, 1);
        }

        // ctx.fillStyle = `rgb(${borderColor[0]}, ${borderColor[1]}, ${borderColor[2]})`;
        // ctx.fillRect(i+xmn, l+ymn, 1, 1);
        // ctx.fillRect(i+xmn, r+ymn, 1, 1);
    }

    P[0] += xmn;
    P[1] += ymn;
    Q[0] += xmn;
    Q[1] += ymn;
    R[0] += xmn;
    R[1] += ymn;

    // drawTriangle(P, Q, R);
}

function fillTriangleBuf(P, Q, R, buf) {
    
    bresenhamLineBuf(P, Q, buf);
    bresenhamLineBuf(P, R, buf);
    bresenhamLineBuf(Q, R, buf);

    for(let i = 0 ; i < buf.length ; i++) {
        let l = Infinity;
        let r = -1;
        for(let j = 0 ; j < buf[0].length ; j++) {
            if(buf[i][j] == 1) {
                l = Math.min(l, j);
                r = Math.max(r, j);
            }
        }
        for(let j = l+1 ; j < r ; j++) {
            buf[i][j] = 2;
        }
    }
}