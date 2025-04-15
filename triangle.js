class Triangle {
    constructor(A, B, C, color) {
        // this.P = A; // to be removed;
        // this.Q = B; // to be removed;
        // this.R = C; // to be removed;
        this.A = A;
        this.B = B;
        this.C = C;
        this.color = color;
        this.n = (B.sub(A)).cross(C.sub(A));

        this.ABorth = this.n.cross(B.sub(A));
        this.ABorth = this.ABorth.mul(1 / (C.sub(A).dot(this.ABorth)));
    
        this.ACorth = this.n.cross(A.sub(C));
        this.ACorth = this.ACorth.mul(1 / (B.sub(A).dot(this.ACorth)));

        this.centroid = A.mul(0.5).add(B.mul(0.25).add(C.mul(0.25)));
    }

    
    
    // normal() {  // to be removed;
    //     const PQ = this.Q.sub(this.P);
    //     const PR = this.R.sub(this.P);
    //     return PQ.cross(PR).normalize();
    // };
}