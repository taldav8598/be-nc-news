const app = require("./app");

app.listen(9091, (err) => {
  if (err) console.log(err);

  console.log("Listening on port 9091");
});
