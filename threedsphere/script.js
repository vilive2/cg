// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Vector operations
function Vector(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.add = (v) => new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  this.sub = (v) => new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  this.mul = (s) => new Vector(this.x * s, this.y * s, this.z * s);
  this.dot = (v) => this.x * v.x + this.y * v.y + this.z * v.z;
  this.cross = (v) =>
    new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  this.norm = () => Math.sqrt(this.dot(this));
  this.normalize = () => this.mul(1 / this.norm());
}

// Ray object
function Ray(origin, direction) {
  this.origin = origin;
  this.direction = direction.normalize();
}

// Triangle object
function Triangle(v0, v1, v2, color) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;
  this.color = color;

  // Ray-Triangle intersection using Möller-Trumbore algorithm
  this.intersect = function (ray) {
    const edge1 = this.v1.sub(this.v0);
    const edge2 = this.v2.sub(this.v0);
    const h = ray.direction.cross(edge2);
    const a = edge1.dot(h);

    if (Math.abs(a) < 1e-6) return null; // Ray parallel to triangle

    const f = 1 / a;
    const s = ray.origin.sub(this.v0);
    const u = f * s.dot(h);

    if (u < 0 || u > 1) return null;

    const q = s.cross(edge1);
    const v = f * ray.direction.dot(q);

    if (v < 0 || u + v > 1) return null;

    const t = f * edge2.dot(q);
    if (t > 1e-6) {
      return t;
    }

    return null;
  };
}

// Cube setup
const side = 200;
const half = side / 2;

// Vertices for the cube
const vertices = [
  new Vector(-half, -half, half),
  new Vector(half, -half, half),
  new Vector(half, half, half),
  new Vector(-half, half, half),
  new Vector(-half, -half, -half),
  new Vector(half, -half, -half),
  new Vector(half, half, -half),
  new Vector(-half, half, -half),
];

// Define triangles for each face of the cube
const triangles = [
  // Front face
  new Triangle(vertices[0], vertices[1], vertices[2], [255, 0, 0]),
  new Triangle(vertices[0], vertices[2], vertices[3], [255, 0, 0]),

  // Back face
  new Triangle(vertices[4], vertices[5], vertices[6], [0, 255, 0]),
  new Triangle(vertices[4], vertices[6], vertices[7], [0, 255, 0]),

  // Top face
  new Triangle(vertices[3], vertices[2], vertices[6], [0, 0, 255]),
  new Triangle(vertices[3], vertices[6], vertices[7], [0, 0, 255]),

  // Bottom face
  new Triangle(vertices[0], vertices[1], vertices[5], [255, 255, 0]),
  new Triangle(vertices[0], vertices[5], vertices[4], [255, 255, 0]),

  // Right face
  new Triangle(vertices[1], vertices[5], vertices[6], [255, 0, 255]),
  new Triangle(vertices[1], vertices[6], vertices[2], [255, 0, 255]),

  // Left face
  new Triangle(vertices[4], vertices[0], vertices[3], [0, 255, 255]),
  new Triangle(vertices[4], vertices[3], vertices[7], [0, 255, 255]),
];

// Rotate Y-axis for better perspective
function rotateY(v, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new Vector(v.x * cos - v.z * sin, v.y, v.x * sin + v.z * cos);
}

// Rotate vertices slightly around Y-axis
const angle = Math.PI / 6;
for (let i = 0; i < vertices.length; i++) {
  vertices[i] = rotateY(vertices[i], angle).add(new Vector(0, 0, 500));
}

// Draw wireframe to highlight triangle edges
function drawWireframe() {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  for (const [start, end] of edges) {
    const p1 = project(vertices[start]);
    const p2 = project(vertices[end]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

// Project 3D point to 2D using perspective projection
function project(v) {
  const fov = 500; // Focal length
  const scale = fov / (fov + v.z);
  return {
    x: canvas.width / 2 + v.x * scale,
    y: canvas.height / 2 - v.y * scale,
  };
}

// Trace function for ray intersection with triangles
function trace(ray) {
  let nearest = Infinity;
  let hitTriangle = null;

  for (const triangle of triangles) {
    const t = triangle.intersect(ray);
    if (t !== null && t < nearest) {
      nearest = t;
      hitTriangle = triangle;
    }
  }

  if (hitTriangle) {
    return hitTriangle.color;
  }

  // Background color
  return [30, 30, 30];
}

// Render function
function render() {
  const w = canvas.width;
  const h = canvas.height;
  const fov = Math.PI / 3;
  const aspectRatio = w / h;

  const imageData = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = (2 * (x + 0.5) / w - 1) * Math.tan(fov / 2) * aspectRatio;
      const py = (1 - 2 * (y + 0.5) / h) * Math.tan(fov / 2);

      const rayOrigin = new Vector(0, 0, -1000); // Move camera back
      const rayDirection = new Vector(px, py, 1);

      const ray = new Ray(rayOrigin, rayDirection);
      const color = trace(ray);

      const index = (x + y * w) * 4;
      imageData.data[index] = color[0];
      imageData.data[index + 1] = color[1];
      imageData.data[index + 2] = color[2];
      imageData.data[index + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // Draw wireframe over the triangles
  drawWireframe();
}

// Render the cube with wireframe
render();
