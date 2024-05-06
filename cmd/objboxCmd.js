#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var args = [];
for (var i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i]);
}
function showUsage() {
    console.log("wrong args !\nusage: \n    objbox anno-class <name> <path>         //create an annotation of class in path\n    objbox anno-property <name> <path>      //create an annotation of property in path\n    objbox anno-method <name> <path>        //create an annotation of method in path\n    objbox anno-methodArg <name> <path>     //create an annotation of methodArg in path\n        ");
}
if (args.length <= 2) {
    showUsage();
}
else {
    try {
        var operation = args[0].toLowerCase();
        var name_1 = args[1];
        var path_1 = args[2];
        var templateFile = {
            "anno-class": "/classAnnotationTemplate.ts.txt",
            "anno-property": "/propertyAnnotationTemplate.ts.txt",
            "anno-method": "/methodAnnotationTemplate.ts.txt",
            "anno-methodarg": "/paramaterAnnotationTemplate.ts.txt",
        };
        if (templateFile[operation] != null) {
            var txt = fs.readFileSync(__dirname + templateFile[operation]);
            path_1 = path_1.replace(/\\/g, "/");
            var last = path_1.lastIndexOf("/");
            var dir = path_1.slice(0, last);
            if (last > 0 && !fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFile(path_1, txt.toString().replace(/%AnnotationName%/g, name_1), { flag: "a" }, function () {
                console.log("Successfully ! Annotation \"@".concat(name_1, "\" is in ").concat(fs.realpathSync(path_1)));
            });
        }
        else {
            showUsage();
        }
    }
    catch (err) {
        console.log("Error: " + err.stack);
    }
}
