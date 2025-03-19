function PlyParser() {
    this.vertices = [];
    this.faces = [];

    this.parse = function(content) {
        this.vertices = [];
        this.faces = [];
        
        const lines = content.split('\n');
        let isHeader = true;

        for(let line of lines ) {
            line = line.trim();

            if (line.startsWith('ply') || line.startsWith('comment') || line.length === 0) {
                continue;
            }

            if (isHeader) {
                if (line.startsWith('end_header')) {
                    isHeader = false;
                }
                continue;
            }

            if (line.match(/^(\d+\s+){3,}\d+$/)) {
                const face = line.split(' ').map(Number);
                this.faces.push(face.slice(1));
            } else {
                const vertex = line.split(' ').map(Number).slice(0,3);
                vertex.push(1);
                this.vertices.push(vertex);
            }
        }
    };
}