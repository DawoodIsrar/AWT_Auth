const upload = require("../middleware/videomiddleware");
const dbConfig = require("../config/videodb");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.url;

const baseUrl = "http://localhost:8000/fs.files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
    try {
      await upload(req, res);
      console.log(req.files);
  
      if (req.files.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }
  
      return res.status(200).send({
        message: "Files have been uploaded.",
      });
  
      // console.log(req.file);
  
      // if (req.file == undefined) {
      //   return res.send({
      //     message: "You must select a file.",
      //   });
      // }
  
      // return res.send({
      //   message: "File has been uploaded.",
      // });
    } catch (error) {
      console.log(error);
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).send({
          message: "Too many files to upload.",
        });
      }
      return res.status(500).send({
        message: `Error when trying upload many files: ${error}`,
      });
  
      // return res.send({
      //   message: "Error when trying upload image: ${error}",
      // });
    }
  };
  const getListFiles = async (req, res) => {
    try {
      await mongoClient.connect();
  
      const database = mongoClient.db(dbConfig.database);
      const images = database.collection(dbConfig.imgBucket + ".files");
  
      const cursor = images.find({});
  
      if ((await cursor.count()) === 0) {
        return res.status(500).send({
          message: "No files found!",
        });
      }
  
      let fileInfos = [];
      await cursor.forEach((doc) => {
        fileInfos.push({
          name: doc.filename,
          url: baseUrl + doc.filename,
        });
      });
  
      return res.status(200).send(fileInfos);
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  };
  
const getSingleVideo = async (req,res)=>{
    const mongoClient = new MongoClient(dbConfig.url);

    try {
      await mongoClient.connect();
  
      const database = mongoClient.db(dbConfig.database);
      const bucket = new GridFSBucket(database, { bucketName: dbConfig.imgBucket });
  
      const fileId = req.params.id;
  
      const file = await database.collection(`${dbConfig.imgBucket}.files`).findOne({ _id: fileId });
  
      if (!file) {
        return res.status(404).send({
          message: 'Video file not found!',
        });
      }
  
      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.pipe(res);
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    } finally {
      mongoClient.close();
    }
}
const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadFiles,
  getListFiles,
  download,
  getSingleVideo
};



