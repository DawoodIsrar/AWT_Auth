
const upload = async (req,res)=>{
    res.status(200).send({
        message: 'Video uploaded successfully',
        filename: req.file.filename
      });
}
module.export = upload;
