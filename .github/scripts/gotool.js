const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function goTool(file) {
  try {
    const { stdout } = await exec(
      `go tool cover -func ${file} | grep total | awk '{print $3}'`
    );
  
    console.log(`${file} Code Coverage:`, stdout);
    return stdout;
  } catch (error) {
    return "0"
  }
}

module.exports = async ({ file }) => {
  return await goTool(file);
};
