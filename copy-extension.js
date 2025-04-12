const fs = require("fs");
const path = require("path");

async function copyExtension() {
  try {
    fs.cpSync(
      path.resolve(__dirname, "./zoom-extension"),
      path.resolve(__dirname, "./dist/lib/zoom-extension"),
      { recursive: true }
    );
    console.log("Extension folder copied successfully!");
  } catch (err) {
    console.error("Failed to copy extension folder:", err);
  }
}

copyExtension();
