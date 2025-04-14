const epsilon = 0.001;
const UNSTABLE = -1;
const RAY_MISSES_PLANE = -2;

class Vector {
    constructor(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    mul(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    normalize() {
        const len = Math.sqrt(this.dot(this));
        return new Vector(this.x / len, this.y / len, this.z / len);
    }
}

function V(obj) {
    return new Vector(obj.x, obj.y, obj.z);
}

function Ray(P, Q) {
    this.P = P;
    this.d = Q.sub(P).normalize();
    this.Q = Q;

    this.trace = function(triangles) {
        let t = Infinity;
        let col = [0,0,0];

        for(const triangle of triangles) {
            const r = this.rayTriangleIntersection(triangle);
            if (r === UNSTABLE || r === RAY_MISSES_PLANE) continue;
            if ( r < t && r >= 0) {
                t = r;
                col = triangle.color;
            }
        }

        return (t < Infinity) ? col : null;
        // if (t < Infinity) {
        //     // ctx.fillStyle = col;
        //     ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
        //     ctx.fillRect(this.Q.x, this.Q.y, 1, 1);
        //     // console.log("painted", this.Q.x, this.Q.y, col, t);
        // } else {
        //     // console.log("skipped", this.Q.x, this.Q.y, col, t);
        // }
    };

    this.rayTriangleIntersection = function(triangle) {
        let u = triangle.n.dot(this.d);

        if(Math.abs(u) < epsilon) return UNSTABLE;

        let t = ((triangle.A.sub(this.P)).dot(triangle.n)) / u;
        if (t < 0) return RAY_MISSES_PLANE;

        let Q = this.P.add(this.d.mul(t));
        let gamma = (Q.sub(triangle.C)).dot(triangle.ACorth);
        let beta = (Q.sub(triangle.B)).dot(triangle.ABorth);
        let alpha = 1 - (beta + gamma);

        if ( alpha < 0 || beta < 0 || gamma < 0 ) return RAY_MISSES_PLANE;

        return t;
    }
}

onmessage = function (e) {
    const { x, ymn, ymx, cop, triangles } = e.data;
    const results = [];

    const copVec = V(cop);

    const parsedTriangles = triangles.map(t => ({
        A: V(t.A),
        B: V(t.B),
        C: V(t.C),
        n: V(t.n),
        ABorth: V(t.ABorth),
        ACorth: V(t.ACorth),
        color: t.color
    }));

    for (let y = ymn ; y <= ymx ; y++) {
        const Q = new Vector(x, y, 0);
        const ray = new Ray(copVec, Q);
        const color = ray.trace(parsedTriangles);
        if (color) {
            results.push({ x, y, color});
        }
    }

    postMessage(results);
};