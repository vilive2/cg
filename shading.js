function Illumination(Ia, Ip, Is, Ka, Kp, Ks, alpha) {
    this.Ia = Ia;
    this.Ip = Ip;
    this.Is = Is;
    this.Ka = Ka;
    this.Kp = Kp;
    this.Ks = Ks;
    this.alpha = alpha;

    this.shading = function(P, normal, lightDir, viewDir) {
        normal = normal.normalize();
        lightDir = lightDir.normalize();
        viewDir = viewDir.normalize();
        
        const reflectDir = normal
        .mul(2 * normal
        .dot(lightDir))
        .sub(lightDir)
        .normalize();

        const ambient = Ka.map((c) => c * Ia);

        const geom = Math.max(normal.dot(lightDir), 0);
        const diffuse = this.Kp.map((c) => geom * c * this.Ip);

        const shininess = Math.pow(Math.max(viewDir.dot(reflectDir), 0), this.alpha);
        const specular = this.Ks.map((c) => c * shininess * this.Is);
        
        const r = Math.min(255, ambient[0] + diffuse[0] + specular[0]);
        const g = Math.min(255, ambient[1] + diffuse[1] + specular[1]);
        const b = Math.min(255, ambient[2] + diffuse[2] + specular[2]);
        
        return [r, g, b].map((c) => Math.trunc(c));
    };
}