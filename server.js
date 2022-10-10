const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const email = require("./routes/email");
var cors = require("cors");
const { MongoClient } = require("mongoose");

async function main() {
      console.log('hello')
    const mongoDB = 'mongodb+srv://Abdul_Samad:Roman_Empire1279@cluster0.2lfpqmj.mongodb.net/?retryWrites=true&w=majority';
    MongoClient.connect(mongoDB, {useNewUrlParser:true,useUnifiedTopology: true });

    const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
    // const db = mongoose.connection
    // try {
    //     await client.connect();
    //     console.log('db connected')
    // } catch(err) {
    //   console.log('error', err)
    // }
    // // await listDatabases(client);
}

main()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
});

app.get("/", (req, res) => {
  res.send("server live!");
});

app.use("/email", email.router);
