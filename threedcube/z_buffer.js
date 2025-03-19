function zbuffer() {
    const zbuf = Array.from({ length: canvas.width+1 }, () => new Array(canvas.height+1)).fill(Infinity);
    const col = Array.from({ length: canvas.width+1 }, () => new Array(canvas.height+1).fill(0));
    const buf = Array.from({ length: canvas.width+1 }, () => new Array(canvas.height+1).fill(0));

    for(let i = 0 ; i < faces.length ; i++) {
        const n = normalToPlane(vertices[faces[i][0]], vertices[faces[i][1]], vertices[faces[i][2]]);
        const A = n[0];
        const B = n[1];
        const C = n[2];
        const D = -A*vertices[faces[i][0]][0] - B * vertices[faces[i][0]][1] - C * vertices[faces[i][0]][2];
        
        fillTriangleBuf(v2d[faces[i][0]], v2d[faces[i][1]], v2d[faces[i][2]], buf);

        for(let x = 0 ; x < buf.length ; x++) {
            for(let y = 0 ; y < buf[x].length ; y++) {
                if(buf[x][y] == 0) continue;

                let z = (-A*x - B*y - D);
                if(C == 0 && z > 0) {
                    if(zbuf[x][y] == Infinity) col[x][y] = buf[x][y];
                    buf[x][y] = 0;
                    continue;
                }

                if(C != 0) z = z / C;

                if(C == 0 || zbuf[x][y] > z) {
                    zbuf[x][y] = z;
                    col[x][y] = buf[x][y]; 
                }

                buf[x][y] = 0;
            }
        }
    }

    for(let x = 0 ; x < col.length ; x++) {
        for(let y = 0 ; y < col[x].length ; y++) {
            if(col[x][y] == 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, 1, 1);
            } else if(col[x][y] == 2) {
                ctx.fillStyle = "blue";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}
