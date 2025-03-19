function rayTrace() {
    planeCoeff = []
    for(let i = 0 ; i < faces.length ; i++) {
        planeCoeff.push(planeEquationCoeff(v2d[faces[i][0]], v2d[faces[i][1]], v2d[faces[i][2]]));
    }

    let Pv = viewerLocation;

    width = canvas.width;
    height = canvas.height;

    for(let x = 0 ; x < width ; x++) {
        for(let y = 0 ; y < height ; y++) {
            let Ps = [x, y, 0];
            const delP = minus(Ps, Pv);
            let t = Infinity;
            let col = 0;
            
            for(let f = 0 ; f < faces.length ; f++) {
                const dr = dot([planeCoeff[f][0], planeCoeff[f][1], planeCoeff[f][2]], delP);
                if(dr == 0) continue;
                const nr = -dot(planeCoeff[f], [Pv[0], Pv[1], Pv[2], 1]);

                const tprime = nr / dr;
                let P = plus(Pv , scalarMultiply(delP, tprime));
                const [alpha, beta, gama] = barycentricCoordinate(v2d[faces[f][0]], v2d[faces[f][1]], v2d[faces[f][2]], P);
                
                if(tprime < t) {
                    if(isOnBoundary(alpha, beta, gama)) {
                        t = tprime;
                        col = 1;
                    } else if(isInside(alpha, beta, gama)) {
                        t = tprime;
                        col = 2;
                    }
                }
            }

            if(col == 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(x, height - y, 1, 1);
            } else if(col == 2) {
                ctx.fillStyle = "red";
                ctx.fillRect(x, height - y, 1, 1);
            }
        }
    }
}