import yaml from "js-yaml";
import fs from "node:fs";
const Compiler = require("kaitai-struct-compiler");
const compiler = new Compiler();

const srcDir = "./src/structs";
const dstDir = "./generated";

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir);
}

const structFilename = "bbsong.ksy";

const ksyYaml = fs.readFileSync(`${srcDir}/${structFilename}`, "utf8");
const ksy = yaml.load(ksyYaml);

compiler
  .compile("javascript", ksy, null, false /* debugMode */)
  .then((files) => {
    for (const [filename, content] of Object.entries(files)) {
      fs.writeFileSync(`${dstDir}/${filename}`, content as string, "utf8");
    }
  });
