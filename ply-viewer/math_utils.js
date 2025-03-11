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

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return [ x, y, z ];
}