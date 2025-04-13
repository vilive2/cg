function normalToPlane(P, Q, R) {
    const PQ = [Q[0]-P[0], Q[1]-P[1], Q[2]-P[2]];
    const PR = [R[0]-P[0], R[1]-P[1], R[2]-P[2]];

    const a = PQ[1]*PR[2] - PQ[2]*PR[1];
    const b = -(PQ[0]*PR[2] - PQ[2]*PR[0]);
    const c = PQ[0]*PR[1] - PQ[1]*PR[0];

    return [a, b, c];
}

function planeEquationCoeff(P, Q, R) {
    const n = normalToPlane(P, Q, R);
    const A = n[0];
    const B = n[1];
    const C = n[2];
    const D = dot([-A, -B, -C], P); 
    return [A, B, C, D];
}

function dot(x, y) {
    return x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
}

function scalarMultiply(x, alpha) {
    return [alpha*x[0], alpha*x[1], alpha*x[2]];
}

function minus(x, y) {
    return [x[0]-y[0], x[1]-y[1], x[2]-y[2]];
}

function plus(x, y) {
    return [x[0]+y[0], x[1]+y[1], x[2]+y[2]];
}

function barycentricCoordinate(A, B, C, P) {
    const v0 = minus(C, A);
    const v1 = minus(B, A);
    const v2 = minus(P, A);
    const d00 = dot(v0, v0);
    const d01 = dot(v0, v1);
    const d11 = dot(v1, v1);
    const d20 = dot(v2, v0);
    const d21 = dot(v2, v1);

    const denom = d00 * d11 - d01*d01;
    const beta = (d11*d20 - d01*d21) / denom;
    const gama = (d00*d21 - d01*d20) / denom;
    const alpha = 1 - beta - gama;

    return [alpha, beta, gama];
}

function isOnBoundary(alpha, beta, gama) {
    return (alpha == 0 || beta == 0 || gama == 0) && (alpha >= 0 && beta >= 0 && gama >= 0);
}

function isInside(alpha, beta, gama) {
    return alpha >= 0 && alpha <= 1 && beta >= 0 && beta <= 1 && gama >= 0 && gama <= 1
}

function dotProduct(A, B) {
    let rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length;

    if (colsA !== rowsB) {
        throw new Error("Invalid dimensions for matrix multiplication");
    }

    let result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Function to convert Spherical Coordinates to 3D Cartesian Coordinates
function sphericalToCartesian(thetaDeg, phiDeg, radius) {
    const theta = degToRad(thetaDeg); // Convert to radians
    const phi = degToRad(phiDeg);     // Convert to radians

    const x = Math.trunc(radius * Math.sin(phi) * Math.cos(theta));
    const y = Math.trunc(radius * Math.sin(phi) * Math.sin(theta));
    const z = Math.trunc(radius * Math.cos(phi));

    return [ x, y, z ];
}