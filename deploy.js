const ghPages = require("gh-pages");

ghPages.publish("public", () => {
  console.log("🚀 published to github pages!");
});
