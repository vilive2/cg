const epsilon = 0.001;
const UNSTABLE = -1;
const RAY_MISSES_PLANE = -2;

function Ray(P, Q) {
    this.P = P;
    this.d = Q.sub(P).normalize();
    this.Q = Q;

    this.trace = function(ctx, triangles) {
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

        // console.log(this.Q);
        if (t < Infinity) {
            // ctx.fillStyle = col;
            ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
            ctx.fillRect(this.Q.x, this.Q.y, 1, 1);
            // console.log("painted", this.Q.x, this.Q.y, col, t);
        } else {
            // console.log("skipped", this.Q.x, this.Q.y, col, t);
        }
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

function rayTrace(ctx, cop, triangles) {
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

        for(let y = ymn ; y < ymx ; y++) {
            let Q = new Vector(x, y, 0);
            let ray = new Ray(cop, Q);
            ray.trace(ctx, triangles);
            traced += 1;
        }
        workdone = Math.floor((traced / totalPixel) * 100);
        
        x++;
        setTimeout(processRow, 0);
    }

    processRow();
}