function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.add = (v) => new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    this.sub = (v) => new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    this.mul = (s) => new Vector(this.x * s, this.y * s, this.z * s);
    this.dot = (v) => this.x * v.x + this.y * v.y + this.z * v.z;
    this.cross = (v) => new Vector(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
    );
    this.norm = () => Math.sqrt(this.dot(this));
    this.normalize = () => this.mul(1 / this.norm()); 
}