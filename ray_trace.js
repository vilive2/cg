// simple server
// python3 -m http.server 8000

const epsilon = 0.001;
const UNSTABLE = -1;
const RAY_MISSES_PLANE = -2;

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

// onmessage = function (e) {
//     const { x, ymn, ymx, cop, triangles } = e.data;
//     const results = [];

//     for (let y = ymn ; y < ymx ; y++) {
//         const Q = new Vector(x, y, 0);
//         const ray = new Ray(cop, Q);
//         const color = ray.trace(triangles);
//         if (color) {
//             results.push({ x, y, color});
//         }
//     }

//     this.postMessage(results);
// };


function rayTraceUsingBVH(ctx, cop, triangles) {
    const h = ctx.canvas.height;
    const w = ctx.canvas.width;

    let xmx = -1;
    let xmn = w+1;
    let ymx = -1;
    let ymn = h+1;

    for(let i = 0 ; i < v2d.length ; i++) {
        xmx = Math.max(xmx, v2d[i][0]);
        xmn = Math.min(xmn, v2d[i][0]);
        ymx = Math.max(ymx, v2d[i][1]);
        ymn = Math.min(ymn, v2d[i][1]);
    }

    let totalPixel = (xmx - xmn) * (ymx - ymn);
    let traced = 0;

    let workdone = 0;

    const start = performance.now();

    const timerDisplay = document.getElementById("timer");
    const progressBar = document.getElementById("progressBar");

    const timerInterval = setInterval(() => {
        const now = performance.now();
        const elapsed = now - start;

        const milliseconds = Math.floor(elapsed % 1000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const minutes = Math.floor(elapsed / 60000);

        timerDisplay.textContent = `${minutes}:${seconds}:${milliseconds}`;
        if(workdone <= 100) {
            progressBar.textContent = `${workdone}%`;
        } 
        if(workdone == 100) {
            clearInterval(timerInterval);
        }
    }, 100);


    let bvhroot = buildBVH(triangles, 0);

    // printBVH(bvhroot);

    let x = xmn;
    function processRow() {
        if(x > xmx) return;

        for(let y = ymn ; y < ymx ; y++) {
            let Q = new Vector(x, y, 0);
            let ray = new Ray(cop, Q);
            
            let intr = findRayIntersection(bvhroot, ray);

            if(intr != null) {
                ctx.fillStyle = `rgb(${intr.col[0]}, ${intr.col[1]}, ${intr.col[2]})`;
                ctx.fillRect(x, y, 1, 1);
            } else {
                // console.log(x, y, intr);
            }
            traced += 1;
            let p = Math.trunc((traced / totalPixel) * 100);
            if(workdone < p && p % 5 == 0) {
                workdone = p;
            }
        }
        
        x++;
        setTimeout(processRow, 0);
    }

    processRow();
}

function rayTrace(ctx, cop, triangles) {
    const rawTriangles = triangles.map(serializeTriangle);
    const rawCop = serializeVector(cop);

    const h = ctx.canvas.height;
    const w = ctx.canvas.width;

    let xmx = -1;
    let xmn = w+1;
    let ymx = -1;
    let ymn = h+1;

    for(let i = 0 ; i < v2d.length ; i++) {
        xmx = Math.max(xmx, v2d[i][0]);
        xmn = Math.min(xmn, v2d[i][0]);
        ymx = Math.max(ymx, v2d[i][1]);
        ymn = Math.min(ymn, v2d[i][1]);
    }

    let totalPixel = (xmx - xmn) * (ymx - ymn);
    let traced = 0;

    let workdone = 0;

    // const startTime = Date.now();
    const start = performance.now();

    const timerDisplay = document.getElementById("timer");
    const progressBar = document.getElementById("progressBar");

    const timerInterval = setInterval(() => {
        // const elapsed = Date.now() - startTime;
        const now = performance.now();
        const elapsed = now - start;

        const milliseconds = Math.floor(elapsed % 1000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const minutes = Math.floor(elapsed / 60000);

        timerDisplay.textContent = `${minutes}:${seconds}:${milliseconds}`;
        if(workdone <= 100) {
            progressBar.textContent = `${workdone}%`;
        } 
        if(workdone == 100) {
            clearInterval(timerInterval);
        }
    }, 100);

    // for(let x = xmn ; x < xmx ; x++) {
    //     for(let y = ymn ; y < ymx ; y++) {
    //         let Q = new Vector(x, y, 0);
    //         let ray = new Ray(cop, Q);
    //         ray.trace(ctx, triangles);
    //         traced += 1;
    //         let p = Math.trunc((traced / totalPixel) * 100);
    //         if(workdone < p && p % 5 == 0) {
    //             console.log("traced ", p, "%");
    //             workdone = p;
    //         }
    //     }
    // }

    let x = xmn;
    function processRow() {
        if(x > xmx) return;

        const worker = new Worker("ray-worker.js");
        worker.postMessage({ x, ymn, ymx, cop: rawCop, triangles: rawTriangles });

        worker.onmessage = function (e) {
            const results = e.data;
            for (const { x, y, color } of results) {
                ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                ctx.fillRect(x, y, 1, 1);
            }

            traced += (ymx - ymn);
            workdone = Math.floor((traced / totalPixel) * 100);
            x++;
            processRow();
            worker.terminate();
        };

        // for(let y = ymn ; y < ymx ; y++) {
        //     let Q = new Vector(x, y, 0);
        //     let ray = new Ray(cop, Q);
        //     ray.trace(ctx, triangles);
        //     traced += 1;
        // }
        // workdone = Math.floor((traced / totalPixel) * 100);
        
        // x++;
        // setTimeout(processRow, 0);
    }

    processRow();
}

function serializeVector(v) {
    return {x: v.x, y:v.y, z:v.z};
}

function serializeTriangle(t) {
    return {
        A: serializeVector(t.A),
        B: serializeVector(t.B),
        C: serializeVector(t.C),
        n: serializeVector(t.n),
        ABorth: serializeVector(t.ABorth),
        ACorth: serializeVector(t.ACorth),
        color: t.color
    };
}