require("dotenv").config()
const port = process.env.PORT || 8080
const { app } = require("./app");
const { GetDir } = require("./Directory");

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.get("/", GetDir);