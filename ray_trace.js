function rayTrace(Pv, Ps, planeCoeff, vertices) {
    const delP = minus(Ps, Pv);
    let t = Infinity;
    let col = 0;
    
    for(let f = 0 ; f < planeCoeff.length ; f++) {
        const dr = dot([planeCoeff[f][0], planeCoeff[f][1], planeCoeff[f][2]], delP);
        if(dr == 0) continue;
        const nr = -dot(planeCoeff[f], [vx, vy, vz, 1]);

        const tprime = nr / dr;
        let P = plus(Pv , scalarMultiply(delP, tprime));
        const [alpha, beta, gama] = barycentricCoordinate(vertices[faces[f][0]], vertices[faces[f][1]], vertices[faces[f][2]], P);
        
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
        ctx.fillRect(Ps[0], height - Ps[1], 1, 1);
        console.log(Ps, t, col);
    } else if(col == 2) {
        ctx.fillStyle = "red";
        ctx.fillRect(Ps[0], height - Ps[1], 1, 1);
        console.log(Ps, t, col);
    }
}