const zBuffer = Array(canvas.width * canvas.height).fill(Infinity);
// Draw a filled triangle with Z-buffer and interpolation
function drawTriangleZ(v1, v2, v3, p1, p2, p3) {
    const minX = Math.max(0, Math.min(p1[0], p2[0], p3[0]));
    const maxX = Math.min(width - 1, Math.max(p1[0], p2[0], p3[0]));
    const minY = Math.max(0, Math.min(p1[1], p2[1], p3[1]));
    const maxY = Math.min(height - 1, Math.max(p1[1], p2[1], p3[1]));

    const area = edgeFunction(p1, p2, p3);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const p = [ x, y ];

            const w0 = edgeFunction(p2, p3, p) / area;
            const w1 = edgeFunction(p3, p1, p) / area;
            const w2 = edgeFunction(p1, p2, p) / area;

            if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                const z = 1 / (w0 / v1[2] + w1 / v2[2] + w2 / v3[2]);
                const index = y * width + x;

                if (z < zBuffer[index]) {
                    zBuffer[index] = z;

                    ctx.fillRect(x, y, 1, 1);
                    // console.log(x, y);
                }
            }
        }
    }
}

// Calculate edge function to determine barycentric coordinates
function edgeFunction(v0, v1, p) {
    return (p[0] - v0[0]) * (v1[1] - v0[1]) - (p[1] - v0[1]) * (v1[0] - v0[0]);
}