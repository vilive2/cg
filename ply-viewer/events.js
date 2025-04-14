const fileInput = document.getElementById("plyFile");
const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

const phi = document.getElementById("phi");
const theta = document.getElementById("theta");
const r = document.getElementById("r");
const lphi = document.getElementById("lphi");
const ltheta = document.getElementById("ltheta");
const lr = document.getElementById("lr");
const rotx = document.getElementById("rotx");
const roty = document.getElementById("roty");
const rotz = document.getElementById("rotz");
const ka = document.getElementById("ka");
const kd = document.getElementById("kd");
const ks = document.getElementById("ks");
const ia = document.getElementById("ia");
const id = document.getElementById("id");
const is = document.getElementById("is");
const alpha = document.getElementById("alpha");

const phival = document.getElementById("phival");
const thetaval = document.getElementById("thetaval");
const rval = document.getElementById("rval");
const lphival = document.getElementById("lphival");
const lthetaval = document.getElementById("lthetaval");
const lrval = document.getElementById("lrval");
const iaval = document.getElementById("iaval");
const idval = document.getElementById("idval");
const isval = document.getElementById("isval");
const alphaval = document.getElementById("alphaval");
const kaval = document.getElementById("kaval");
const kdval = document.getElementById("kdval");
const ksval = document.getElementById("ksval");
const vloc = document.getElementById("vloc");
const lloc = document.getElementById("lloc");

const vcounts = document.getElementById("vcounts");
const facecounts = document.getElementById("facecounts");

fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    readPLYFile(file);
})

phi.addEventListener("input", () => {
    phival.textContent = phi.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
theta.addEventListener("input", () => {
    thetaval.textContent = theta.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
r.addEventListener("input", () => {
    rval.textContent = r.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});

lphi.addEventListener("input", () => {
    lphival.textContent = lphi.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
ltheta.addEventListener("input", () => {
    lthetaval.textContent = ltheta.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
lr.addEventListener("input", () => {
    lrval.textContent = lr.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
rotx.addEventListener("input", () => {
    render();
});
roty.addEventListener("input", () => {
    render();
});
rotz.addEventListener("input", () => {
    render();
});
document.addEventListener('keydown', function(event) {
    if(event.ctrlKey) {
        if(event.key === 'ArrowUp') {
            scaleby += 100;
            render();
        } else if(event.key === 'ArrowDown') {
            scaleby -= 100;
            render();
        }
    }
});

ia.addEventListener("input", () => {
    // iaval.textContent = ia.value;
    render();
});
id.addEventListener("input", () => {
    // idval.textContent = id.value;
    render();
});
is.addEventListener("input", () => {
    // isval.textContent = is.value;
    render();
});
alpha.addEventListener("input", () => {
    // alphaval.textContent = alpha.value;
    render();
});
ka.addEventListener("input", () => {
    // const col = hexToRgb(ka.value);
    // kaval.textContent = `(${col[0]}, ${col[1]}, ${col[2]})`;
    render();
});
kd.addEventListener("input", () => {
    // const col = hexToRgb(kd.value);
    // kdval.textContent = `(${col[0]}, ${col[1]}, ${col[2]})`;
    render();
});
ks.addEventListener("input", () => {
    // const col = hexToRgb(ks.value);
    // ksval.textContent = `(${col[0]}, ${col[1]}, ${col[2]})`;
    render();
});


function readPLYFile(plyFile) {
    if (!plyFile) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const content = e.target.result;
      plyParser.parse(content);
      vcounts.textContent = `${plyParser.vertices.length}`;
      facecounts.textContent = `${plyParser.faces.length}`;
      render();
    };
    
    reader.readAsText(plyFile);
}

function hexToRgb(hex) {
    // Remove the '#' if present
    hex = hex.replace(/^#/, '');
    
    // Parse hexadecimal values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
}


const radios = document.querySelectorAll('input[name="alg"]');

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        alg = radio.value;
    });
});