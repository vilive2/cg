// Z-buffer algorithm with border and fill colors
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width, height = canvas.height;

// Initialize z-buffer
const zBuffer = Array(width * height).fill(Infinity);

// Project 3D point to 2D
function project(point) {
    const distance = 5;
    return {
        x: Math.floor((point.x / (point.z + distance)) * width + width / 2),
        y: Math.floor((-point.y / (point.z + distance)) * height + height / 2)
    };
}

// Draw a filled triangle with Z-buffer and solid color
function drawTriangle(v1, v2, v3, fillColor, borderColor) {
    const p1 = project(v1);
    const p2 = project(v2);
    const p3 = project(v3);

    const minX = Math.max(0, Math.min(p1.x, p2.x, p3.x));
    const maxX = Math.min(width - 1, Math.max(p1.x, p2.x, p3.x));
    const minY = Math.max(0, Math.min(p1.y, p2.y, p3.y));
    const maxY = Math.min(height - 1, Math.max(p1.y, p2.y, p3.y));

    const area = edgeFunction(p1, p2, p3);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const p = { x, y };

            const w0 = edgeFunction(p2, p3, p) / area;
            const w1 = edgeFunction(p3, p1, p) / area;
            const w2 = edgeFunction(p1, p2, p) / area;

            if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                const z = 1 / (w0 / v1.z + w1 / v2.z + w2 / v3.z);
                const index = y * width + x;

                if (z < zBuffer[index]) {
                    zBuffer[index] = z;
                    ctx.fillStyle = fillColor;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    // Draw triangle border
    ctx.strokeStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.stroke();
}

// Calculate edge function to determine barycentric coordinates
function edgeFunction(v0, v1, p) {
    return (p.x - v0.x) * (v1.y - v0.y) - (p.y - v0.y) * (v1.x - v0.x);
}

// Define 3D triangles with fill and border colors
const triangles = [
    {
        v1: { x: -1, y: -1, z: 3 }, v2: { x: 1, y: -1, z: 3 }, v3: { x: 0, y: 1, z: 3 },
        fillColor: "#ffcc00", borderColor: "#000000"
    },
    {
        v1: { x: -1, y: -1, z: 5 }, v2: { x: 1, y: -1, z: 5 }, v3: { x: 0, y: 1, z: 5 },
        fillColor: "#00ccff", borderColor: "#000000"
    },
    {
        v1: { x: -1, y: -1, z: 7 }, v2: { x: 1, y: -1, z: 7 }, v3: { x: 0, y: 1, z: 7 },
        fillColor: "#cc00ff", borderColor: "#000000"
    }
];

// Render triangles
triangles.forEach(({ v1, v2, v3, fillColor, borderColor }) => {
    drawTriangle(v1, v2, v3, fillColor, borderColor);
});
