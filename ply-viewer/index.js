document.getElementById('viewerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const plyFile = document.getElementById('plyFile').files[0];
    const scale = document.getElementById('scale').value;
    const viewerLocation = document.getElementById('viewerLocation').value.split(',').map(Number);
    const projectionPlane = document.getElementById('projectionPlane').value;

    readPLYFile(plyFile, scale, viewerLocation, projectionPlane);
    
});

const canvas = document.getElementById("3dCanvas");
const ctx = canvas.getContext("2d");

// Example: Placeholder for rendering a grid or shapes
ctx.fillStyle = '#fff';
ctx.font = '16px Arial';
ctx.fillText('3D Viewer Canvas', 10, 20);

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

function readPLYFile(plyFile, scale, viewerLocation, projectionPlane) {
  if (!plyFile) return;
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const content = e.target.result;
    parsePLY(content, scale, viewerLocation, projectionPlane);
  };
  
  reader.readAsText(plyFile);
}

function parsePLY(content, scale, viewerLocation, projectionPlane) {
    const lines = content.split('\n');
    let isHeader = true;
    let vertices = [];
    let faces = [];
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip empty lines or comments
        if (line.startsWith('ply') || line.startsWith('comment') || line.length === 0) {
        continue;
        }
        
        // Parse header (skip if isHeader is true)
        if (isHeader) {
        if (line.startsWith('end_header')) {
            isHeader = false;
        }
        continue;
        }
        
        // Parse faces
        if (line.match(/^(\d+\s+){3,}\d+$/)) { // Pattern for faces (list of vertex indices)
        const face = line.split(' ').map(Number);
        faces.push(face.slice(1)); // First number is the count of vertices
        } else {// Parse vertices
            const vertex = line.split(' ').map(Number);
            vertices.push(vertex);
        }
    }

    shift_vector = [0, 0, 0]
    
    for(let i = 0 ; i < vertices.length ; i++) {
        shift_vector[0] = Math.max(shift_vector[0], -vertices[i][0]);
        shift_vector[1] = Math.max(shift_vector[1], -vertices[i][1]);
        shift_vector[2] = Math.max(shift_vector[2], -vertices[i][2]);
    }
    
    for(let i = 0 ; i < vertices.length ; i++) {
        vertices[i][0] += shift_vector[0];
        vertices[i][1] += shift_vector[1];
        vertices[i][2] += shift_vector[2];

        vertices[i][0] *= scale;
        vertices[i][1] *= scale;
        vertices[i][2] *= scale;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    plotVertices(viewerLocation, vertices, projectionPlane);
    plotFaces(viewerLocation, vertices, faces, projectionPlane);
}

function projectXY(viewer, point) {
    let x = Math.trunc((viewer[0]*point[2]+viewer[2]*point[0]) / (viewer[2]+point[2]));
    let y = Math.trunc((viewer[1]*point[2]+viewer[2]*point[1]) / (viewer[2]+point[2]));

    return [x, y];
}

function projectXZ(viewer, point) {
    let x = Math.trunc((viewer[0]*point[1]+viewer[1]*point[0]) / (viewer[1]+point[1]));
    let z = Math.trunc((viewer[2]*point[1]+viewer[1]*point[2]) / (viewer[1]+point[1]));

    return [x, z];
}

function projectYZ(viewer, point) {
    let y = Math.trunc((viewer[1]*point[0]+viewer[0]*point[1]) / (viewer[0]+point[0]));
    let z = Math.trunc((viewer[2]*point[0]+viewer[0]*point[2]) / (viewer[0]+point[0]));

    return [y, z];
}

function plotVertex(viewer, vertex, projectionPlane) {
    switch(projectionPlane) {
        case "xy":
            var cord = projectXY(viewer, vertex);
            var x = cord[0];
            var y = canvas.height - cord[1];
            ctx.fillRect(x, y, 1, 1);
            break;
        case "yz":
            cord = projectYZ(viewer, vertex);
            y = canvas.height - cord[0];
            var z = canvas.width - cord[1];
            ctx.fillRect(z, y, 1, 1);
            break;
        case "xz":
            cord = projectXZ(viewer, vertex);
            x = cord[0];
            z = cord[1];
            ctx.fillRect(x, z, 1, 1);
            break;
    }
}

function plotVertices(viewer, vertices, projectionPlane) {
    for(let i = 0 ; i < vertices.length ; i++) {
        plotVertex(viewer, vertices[i], projectionPlane);
    }
}

function plotFaces(viewer, vertices, faces, projectionPlane) {
    for(let i = 0 ; i < faces.length ; i++) {
        for(let j = 0 ; j < faces[i].length ; j++) {
            k = (j + 1) % faces[i].length;
            switch(projectionPlane) {
                case "xy":
                    plotLineXY(viewer, vertices[faces[i][j]], vertices[faces[i][k]]);
                    break;
                case "yz":
                    plotLineYZ(viewer, vertices[faces[i][j]], vertices[faces[i][k]]);
                    break;
                case "xz":
                    plotLineXZ(viewer, vertices[faces[i][j]], vertices[faces[i][k]]);
                    break;
            }
        }
    }
}

function plotLineXY(viewer, v1, v2) {
    let cord = projectXY(viewer, v1);
    let x1 = cord[0];
    let y1 = canvas.height - cord[1];
    
    cord = projectXY(viewer, v2);
    let x2 = cord[0];
    let y2 = canvas.height - cord[1];
    
    bresenhamLine(x1, y1, x2, y2);
}

function plotLineYZ(viewer, v1, v2) {
    let cord = projectYZ(viewer, v1);
    let y1 = canvas.height - cord[0];
    let z1 = canvas.width - cord[1];
    
    cord = projectYZ(viewer, v2);
    let y2 = canvas.height - cord[0];
    let z2 = canvas.width - cord[1];
    
    bresenhamLine(z1, y1, z2, y2);
}

function plotLineXZ(viewer, v1, v2) {
    let cord = projectXZ(viewer, v1);
    let x1 = cord[0];
    let z1 = cord[1];
    
    cord = projectXZ(viewer, v2);
    let x2 = cord[0];
    let z2 = cord[1];
    
    bresenhamLine(x1, z1, x2, z2);
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