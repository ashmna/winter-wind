const fs = require("fs");
const execSync = require('child_process').execSync;

const genFlowFilesRecursively = dir => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (fs.statSync(dir + file).isDirectory()) {
            genFlowFilesRecursively(dir + file + '/');
        } else if (file.split(".").pop() === "js") {
            const js = dir + file;
            const flow = "./lib/" + js.substr(6) + ".flow";
            execSync(`flow gen-flow-files ${js} > ${flow}`);
        }
    });
};

genFlowFilesRecursively("./src/");
