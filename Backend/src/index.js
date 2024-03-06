require("dotenv").config()
const port = process.env.PORT || 8080
const { app } = require("./app");
const { GetDir, downloadFile } = require("./Directory");
const path  = require("path")


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.post("/getDir", GetDir);
app.post("/download", downloadFile);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});