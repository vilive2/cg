const AXIS_X = 0, AXIS_Y = 1, AXIS_Z = 2;

class BVHNode {
    constructor() {
        this.triangles = [];
        this.xmin = Infinity;
        this.xmax = -Infinity;
        this.ymin = Infinity;
        this.ymax = -Infinity;
        this.zmin = Infinity;
        this.zmax = -Infinity;
        this.left = null;
        this.right = null;
    }

    addTriangle(triangle) {
        this.triangles.push(triangle);
        this.addVertex(triangle.A);
        this.addVertex(triangle.B);
        this.addVertex(triangle.C);
    }

    addVertex(V) {
        this.xmin = Math.min(this.xmin, V.x);
        this.xmax = Math.max(this.xmax, V.x);
        this.ymin = Math.min(this.ymin, V.y);
        this.ymax = Math.max(this.ymax, V.y);
        this.zmin = Math.min(this.zmin, V.z);
        this.zmax = Math.max(this.zmax, V.z);
    }

    hit(ray) {
        let txmn = this.txMin(ray), txmx = this.txMax(ray);
        let tymn = this.tyMin(ray), tymx = this.tyMax(ray);
        let tzmn = this.tzMin(ray), tzmx = this.tzMax(ray);

        if(txmn > txmx) {
            [txmn, txmx] = [txmx, txmn];
        }

        if(tymn > tymx) {
            [tymn, tymx] = [tymx, tymn];
        }

        if(tzmn > tzmx) {
            [tzmn, tzmx] = [tzmx, tzmn];
        }

        let tmn = Math.max(txmn, tymn, tzmn);
        let tmx = Math.min(txmx, tymx, tzmx);

        return tmn <= tmx;
    }

    txMin(ray) {
        if(ray.d.x === 0) {
            if(this.xmin - ray.P.x < 0) return -Infinity;
            else return Infinity;
        }
        return (this.xmin - ray.P.x) / ray.d.x;
    }
    txMax(ray) {
        if(ray.d.x === 0) {
            if(this.xmax - ray.P.x < 0) return -Infinity;
            else return Infinity;          
        }
        return (this.xmax - ray.P.x) / ray.d.x;
    }

    tyMin(ray) {
        if(ray.d.y === 0) {
            if(this.ymin - ray.P.y < 0) return -Infinity;
            else return Infinity;
        }
        return (this.ymin - ray.P.y) / ray.d.y;
    }
    tyMax(ray) {
        if(ray.d.y === 0) {
            if(this.ymax - ray.P.y < 0) return -Infinity;
            else return Infinity;
        }
        return (this.ymax - ray.P.y) / ray.d.y;
    }

    tzMin(ray) {
        if(ray.d.z === 0) {
            if (this.zmin - ray.P.z < 0) return -Infinity;
            else return Infinity;
        }
        return (this.zmin - ray.P.z) / ray.d.z;
    }
    tzMax(ray) {
        if(ray.d.z === 0) {
            if(this.zmax - ray.P.z < 0) return -Infinity;
            else return Infinity;
        }
        return (this.zmax - ray.P.z) / ray.d.z;
    }

    print() {
        console.log([this.xmin, this.xmax], [this.ymin, this.ymax], [this.zmin, this.zmax], this.triangles.length);
    }
}

function printBVH(root) {
    if(root == null) return;
    printBVH(root.left);
    root.print();
    printBVH(root.right);
}

function buildBVH(triangles, ht) {
    if (ht === 10) return null;
    if (triangles.length == 0) return null;

    let root = new BVHNode();

    for(let triangle of triangles) 
        root.addTriangle(triangle);

    let axis = AXIS_X;
    if(root.ymax - root.ymin > root.xmax - root.xmin)
        axis = AXIS_Y;
    else if(root.zmax - root.zmin > root.xmax - root.xmin)
        axis = AXIS_Z;
    if(axis === AXIS_Y && root.zmax - root.zmin > root.ymax - root.ymin)
        axis = AXIS_Z;

    triangles.sort((a, b) => {
        if (axis === AXIS_X)
            return a.centroid.x - b.centroid.x;
        else if(axis === AXIS_Y)
            return a.centroid.y - b.centroid.y;
        else
            return a.centroid.z - b.centroid.z;
    });

    let leftTriangles = [];
    let rightTriangles = [];

    let mid = 0;
    if(axis === AXIS_X)
        mid = (root.xmin + root.xmax) / 2;
    else if(axis === AXIS_Y) 
        mid = (root.ymin + root.ymax) / 2;
    else 
        mid = (root.zmin + root.zmax) / 2;

    for(let triangle of triangles) {
        let toleft = 1;
        if (axis === AXIS_X && mid < triangle.centroid.x)
            toleft = 0;
        if(axis === AXIS_Y && mid < triangle.centroid.y)
            toleft = 0;
        if(axis === AXIS_Z && mid < triangle.centroid.z)
            toleft = 0;

        if(toleft) 
            leftTriangles.push(triangle);
        else
            rightTriangles.push(triangle);
    }

    root.left = buildBVH(leftTriangles, ht+1);
    root.right = buildBVH(rightTriangles, ht+1);

    return root;
}

function findRayIntersection(root, ray) {
    if(root == null) return null;
    if(!root.hit(ray)) return null;

    if(root.left == null && root.right == null) {
        let t = Infinity;
        let col = [];
        for(const triangle of root.triangles) {
            const r = ray.rayTriangleIntersection(triangle);
            
            if (r === UNSTABLE || r === RAY_MISSES_PLANE) continue;
            
            if ( r < t && r >= 0) {
                t = r;
                col = triangle.color;
            }
        }

        return (t<Infinity) ? {t, col}:null;
    }

    let leftInter = findRayIntersection(root.left, ray);
    let rightInter = findRayIntersection(root.right, ray);

    if(leftInter == null) return rightInter;
    if(rightInter == null) return leftInter;

    if(leftInter.t < rightInter.t) return leftInter;

    return rightInter;
}