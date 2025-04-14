function fillTriangleZ(P, Q, R, z1, z2, z3, faceColor, zbuf, framebuf) {
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

    const ar = arTriangle(P, Q, R);
    if(ar === 0) {
        return;
    }

    for(let i = 0 ; i < buf.length ; i++) {
        let l = ymx+1;
        let r = -1;
        for(let j = 0 ; j < buf[0].length ; j++) {
            if(buf[i][j] == 1) {
                l = Math.min(l, j);
                r = Math.max(r, j);
            }
        }
        for(let j = l ; j <= r ; j++) {
            let S = [i+xmn, j+ymn];
            const w1 = arTriangle(Q, R, S) / ar;
            const w2 = arTriangle(P, R, S) / ar;
            const w3 = arTriangle(P, Q, S) / ar;
            const z = w1 * z1 + w2 * z2 + w3 * z3;

            const index = S[1]*canvas.width + S[0];
            if(z < zbuf[index]) {
                zbuf[index] = z;
                framebuf[index*4] = faceColor[0];
                framebuf[index*4 + 1] = faceColor[1];
                framebuf[index*4 + 2] = faceColor[2];
                framebuf[index*4 + 3] = 255;
            }
        }
    }

    P[0] += xmn;
    P[1] += ymn;
    Q[0] += xmn;
    Q[1] += ymn;
    R[0] += xmn;
    R[1] += ymn;
}

function arTriangle(P, Q, R) {
    return Math.abs(0.5 * (P[0]*(Q[1]-R[1]) + Q[0]*(R[1]-P[1]) + R[0]*(P[1]-Q[1])));
}