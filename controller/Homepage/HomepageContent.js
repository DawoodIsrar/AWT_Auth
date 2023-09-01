const dbConfig = require("../../config/db");
const homepageContent = require("../../Models/HompageContent");


const uploadContent = async (req, res) => {
  try {

  console.log(req.body);
 if(req.body == null){
  return res.status(200).json({
    message:"sorry you have to porvide title and content text"
  })

 }
 if(req.body.title == null)  {
  return res.status(200).json({
    message:"sorry you have to porvide title"
  })
 }
 if(req.body.text == null)  {
  return res.status(200).json({
    message:"sorry you have to porvide content text"
  })
 }else{
  const HomePageContent = await homepageContent.create({
    title:req.body.title,
    text:req.body.text
  })
  console.log("Course created:", HomePageContent);
  return res
  .status(201)
  .json({ message: "HomePage content is created succesfully" });
 }

  
 

} catch (err) {
    console.log(err);
    return res.status(500).send("internal server error");
  } 
}

const getListContent = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const contentCollection = database.collection("HomePageContent");

    const contentList = await contentCollection.find().toArray();

    return res.status(200).send(contentList);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  } finally {
    mongoClient.close();
  }
};

const deleteContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const contentCollection = database.collection("HomePageContent");

    const result = await contentCollection.deleteOne({ _id: contentId });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Content not found!" });
    }

    return res.status(200).send({
      message: "Homepage content deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  } finally {
    mongoClient.close();
  }
};

module.exports = {
  uploadContent,
  getListContent,
  deleteContent,
};
