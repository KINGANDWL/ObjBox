#!/usr/bin/env node
import * as fs from "fs"

let args: string[] = []
for (let i = 2; i < process.argv.length; i++) {
    args.push(process.argv[i])
}

function showUsage() {
    console.log(
        `wrong args !
usage: 
    objbox anno-class <name> <path>         //create an annotation of class in path
    objbox anno-property <name> <path>      //create an annotation of property in path
    objbox anno-method <name> <path>        //create an annotation of method in path
    objbox anno-methodArg <name> <path>     //create an annotation of methodArg in path
        `)
}

if (args.length <= 2) {
    showUsage()
} else {
    try {
        let operation = args[0].toLowerCase()
        let name = args[1]
        let path = args[2]

        let templateFile = {
            "anno-class": "/classAnnotationTemplate.ts.txt",
            "anno-property": "/propertyAnnotationTemplate.ts.txt",
            "anno-method": "/methodAnnotationTemplate.ts.txt",
            "anno-methodArg": "/paramaterAnnotationTemplate.ts.txt",
        }

        if (templateFile[operation] != null) {
            let txt = fs.readFileSync(__dirname + templateFile[operation])
            path = path.replace(/\\/g, "/");
            let last = path.lastIndexOf("/");let dir = path.slice(0, last);
            if (last >0 && !fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            fs.writeFile(
                path,
                txt.toString().replace(/%AnnotationName%/g, name),
                { flag: "a", },
                function () {
                    console.log(`Successfully ! Annotation "@${name}" is in ${fs.realpathSync(path)}`)
                }
            )
        } else {
            showUsage()
        }
    } catch (err) {
        console.log("Error: " + (err as Error).stack)
    }
}