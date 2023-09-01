const AboutUs = require("../../../Models/About");
const mongoose = require("mongoose");

const uploadABoutContent = async (req, res) => {
  console.log(req.body);

  try {
    // Connect to the MongoDB database
    await mongoose.connect("mongodb://127.0.0.1:27017/AWT");

    // Create a new AboutUs document
    await AboutUs.create({
      title: req.body.title,
      text: req.body.text,
    });

    // Close the database connection
    await mongoose.connection.close();

    return res.status(200).json({
      message: "Created",
    });
  } catch (error) {
    console.error("Error uploading about content:", error);
    return res.status(500).json({
      message: "An error occurred while uploading content.",
    });
  }
};

// Function to delete content by title
const deleteContentByTitle = async (req, res) => {
    try {
          // Connect to the MongoDB database
    await mongoose.connect("mongodb://127.0.0.1:27017/AWT");
      // Delete the content by title
      await AboutUs.deleteOne({ title: req.params.title });
     // Close the database connection
     await mongoose.connection.close();
      return res.status(200).json({
        message: "Content deleted",
      });
   
    } catch (error) {
      console.error("Error deleting content:", error);
      return res.status(500).json({
        message: "An error occurred while deleting content.",
      });
    }
  };
  
  // Function to get a list of content
  const getListOfContent = async (req, res) => {
    try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AWT");

      // Fetch all content documents
      const contentList = await AboutUs.find({}, "title text");
     // Close the database connection
     await mongoose.connection.close();
      return res.status(200).json(contentList);
    } catch (error) {
      console.error("Error getting list of content:", error);
      return res.status(500).json({
        message: "An error occurred while fetching content list.",
      });
    }
  };
  
  module.exports = {
    uploadABoutContent,
    deleteContentByTitle,
    getListOfContent,
  };