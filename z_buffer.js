const zBuffer = Array(canvas.width * canvas.height).fill(Infinity);
// Draw a filled triangle with Z-buffer and interpolation
function drawTriangleZ(v1, v2, v3, p1, p2, p3) {
    const minX = Math.max(0, Math.min(p1[0], p2[0], p3[0]));
    const maxX = Math.min(canvas.width - 1, Math.max(p1[0], p2[0], p3[0]));
    const minY = Math.max(0, Math.min(p1[1], p2[1], p3[1]));
    const maxY = Math.min(canvas.height - 1, Math.max(p1[1], p2[1], p3[1]));

    const area = edgeFunction(p1, p2, p3);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const p = [ x, y ];

            const w0 = edgeFunction(p2, p3, p) / area;
            const w1 = edgeFunction(p3, p1, p) / area;
            const w2 = edgeFunction(p1, p2, p) / area;

            if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                const z = 1 / (w0 / v1[2] + w1 / v2[2] + w2 / v3[2]);
                const index = y * canvas.width + x;

                if (z < zBuffer[index]) {
                    zBuffer[index] = z;

                    ctx.fillRect(x, y, 1, 1);
                    console.log(x, y);
                }
            }
        }
    }
}

// Calculate edge function to determine barycentric coordinates
function edgeFunction(v0, v1, p) {
    return (p[0] - v0[0]) * (v1[1] - v0[1]) - (p[1] - v0[1]) * (v1[0] - v0[0]);
}


function fillTriangleZ(P, Q, R, faceColor, borderColor, z1, z2, z3, zbuf, framebuf) {
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
        // console.log(faceColor, ar, P, Q, R);
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
        ctx.fillStyle = `rgb(${faceColor[0]}, ${faceColor[1]}, ${faceColor[2]})`;
        for(let j = l ; j <= r ; j++) {
            // let S = [i+xmn, j+ymn];
            // const w1 = arTriangle(Q, R, S) / ar;
            // const w2 = arTriangle(P, R, S) / ar;
            // const w3 = arTriangle(P, Q, S) / ar;
            // const z = w1 * z1 + w2 * z2 + w3 * z3;

            // const index = S[1]*canvas.width + S[0];
            // if(z < zbuf[index]) {
            //     zbuf[index] = z;
            //     framebuf[index*4] = faceColor[0];
            //     framebuf[index*4 + 1] = faceColor[1];
            //     framebuf[index*4 + 2] = faceColor[2];
            //     framebuf[index*4 + 3] = 255;
                ctx.fillRect(i+xmn, j+ymn, 1, 1);
            // }
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

function arTriangle(P, Q, R) {
    return Math.abs(0.5 * (P[0]*(Q[1]-R[1]) + Q[0]*(R[1]-P[1]) + R[0]*(P[1]-Q[1])));
}