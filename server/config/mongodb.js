const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://brandonvincentius54321:sX4j5xCL3UFTmxCw@rmt54.wxnng.mongodb.net/?retryWrites=true&w=majority&appName=RMT54";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("gc01-p3")

module.exports = {database}
