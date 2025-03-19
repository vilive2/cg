const fileInput = document.getElementById("plyFile");
const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

const phi = document.getElementById("phi");
const theta = document.getElementById("theta");
const r = document.getElementById("r");
const scale = document.getElementById("scale");
const tx = document.getElementById("tx");
const ty = document.getElementById("ty");

const phival = document.getElementById("phival");
const thetaval = document.getElementById("thetaval");
const rval = document.getElementById("rval");
const scaleval = document.getElementById("scaleval");
const txval = document.getElementById("txval");
const tyval = document.getElementById("tyval");

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
scale.addEventListener("input", () => {
    scaleval.textContent = scale.value;
    try {
        render();
    } catch(error) {
        console.log(error);
    }
});
tx.addEventListener("input", () => {
    txval.textContent = tx.value;
    render();
});
ty.addEventListener("input", () => {
    tyval.textContent = ty.value;
    render();
});

function readPLYFile(plyFile) {
    if (!plyFile) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const content = e.target.result;
      plyParser.parse(content);
    };
    
    reader.readAsText(plyFile);
}