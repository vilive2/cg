const fileInput = document.getElementById("fileInput");
const fileContent = document.getElementById("fileContent");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];
    if (file && file.name.endsWith(".obj")) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const content = event.target.result;
            const lines = content.split("\n");

            const vertices = lines
            .filter(line => line.startsWith("v "))
            .map(line => {
                const [_, x, y, z] = line.split(/\s+/);
                return [parseFloat(x), parseFloat(y), parseFloat(z)];
            });

            const faces = lines
            .filter(line => line.startsWith("f "))
            .map(line => {
                const indices = line
                .split(/\s+/)
                .slice(1)
                .map(entry => parseInt(entry.split("//")[0])-1);
                return indices;
            })

            shift_vector = [0, 0, 0]
            viewer = [20000, 50, 50]

            for(let i = 0 ; i < vertices.length ; i++) {
                shift_vector[0] = Math.max(shift_vector[0], -vertices[i][0]);
                shift_vector[1] = Math.max(shift_vector[1], -vertices[i][1]);
                shift_vector[2] = Math.max(shift_vector[2], -vertices[i][2]);
            }

            for(let i = 0 ; i < vertices.length ; i++) {
                vertices[i][0] += shift_vector[0];
                vertices[i][1] += shift_vector[1];
                vertices[i][2] += shift_vector[2];
            }

            plotVertices(viewer, vertices);
            // plotFaces(viewer, vertices, faces);
        };

        reader.readAsText(file);
    } else {
        alert("Please select a valid .obj file.");
    }
});

function plotVertices(viewer, vertices) {
    for(let i = 0 ; i < vertices.length ; i++) {
        let y = 1500 - Math.trunc((viewer[1]*vertices[i][0]+vertices[i][1]*viewer[0]) / (viewer[0]+vertices[i][0]));
        let z = 1500 - Math.trunc((viewer[0]*vertices[i][0]+vertices[i][2]*viewer[0]) / (viewer[0]+vertices[i][0]));
        ctx.fillRect(z, y, 1, 1);
    }
}

function plotFaces(viewer, vertices, faces) {
    for(let i = 0 ; i < faces.length ; i++) {
        for(let j = 0 ; j < faces[i].length ; j++) {
            k = (j + 1) % faces[i].length;
            plotLine(viewer, vertices[faces[i][j]], vertices[faces[i][k]]);
        }
    }
}

function plotLine(viewer, v1, v2) {
    let y1 = 1500 - Math.trunc((viewer[1]*v1[0]+v1[1]*viewer[0]) / (viewer[0]+v1[0]));
    let z1 = 1500 - Math.trunc((viewer[0]*v1[0]+v1[2]*viewer[0]) / (viewer[0]+v1[0]));
    
    let y2 = 1500 - Math.trunc((viewer[1]*v2[0]+v2[1]*viewer[0]) / (viewer[0]+v2[0]));
    let z2 = 1500 - Math.trunc((viewer[0]*v2[0]+v2[2]*viewer[0]) / (viewer[0]+v2[0]));

    bresenhamLine(z1, y1, z2, y2);
}

function bresenhamLine(x1, y1, x2, y2) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        ctx.fillRect(x1, y1, 1, 1);  // Draw pixel

        if (x1 === x2 && y1 === y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
}


























// function readFile(fileName) {
//     fetch(fileName)
//     .then(response => {
//         if(!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.text();
//     })
//     .then(data => {
//         document.getElementById("fileContent").textContent = data;
//     })
//     .catch(error => {
//         console.error("Error reading the file:", error);
//         document.getElementById("fileContent").textContent = "Error loading file.";
//     });
// }

// readFile("eagle/Eagle_custom_Normals.obj")