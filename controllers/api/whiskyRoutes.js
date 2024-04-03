const router = require('express').Router();
const { Whisky, Rating } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');

const Sequelize = require('sequelize');


// Get all whiskeys
router.get('/', async (req, res) => {
  //TODO - Add auth
  try {
    let whiskyData = await Whisky.findAll();
    if (whiskyData) {
      res.status(200).json(JSON.stringify(whiskyData));
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving whisky data");
  }


})


// Search whiskey by name
// http://localhost:3001/api/whiskeys/John

router.get('/:name', async (req, res) => {
  //TODO - Add auth
  let whiskyName = req.params.name;
  console.log("Search for " + whiskyName);
  try {
    // Search whiskey by name 
    // const whiskeyData = await Whisky.findOne({ where: { name: { [Sequelize.Op.like]: whiskyName + "%" } } });
    const whiskeyData = await Whisky.findAll({ where: { name: { [Sequelize.Op.like]: whiskyName + "%" } } });
    if (whiskeyData) {
      console.log(whiskeyData)
      res.status(200).json(JSON.stringify(whiskeyData));
    }
    else {
      console.log("Whisky not found");
      res.status(404).send("Whiskey not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error searching whikey by name");
  }
  // switch(whisky) {
  //   case 'chivas-12': 
  //         res.sendFile(path.join(__dirname, '../../public/assets/images/chivas-regal-12.jpg'));
  //         break;
  //   case 'chivas-18':
  //         res.sendFile(path.join(__dirname,'../../public/assets/images/chivas-regal-18.jpg'));
  //         break;
  //   case  'chivas-25':
  //         res.sendFile(path.join(__dirname,'../../public/assets/images/chivas-regal-25.jpg'));
  //         break;
  //   default:
  //         console.log("Whisky not found:" + whisky);
  //         res.status(404).send('Whisky Not Found: ' + whisky);     
  // }

})

// Add whiskey 
//router.post('/', withAuth, async (req, res) => {
// TODO. Add auth
router.post('/', async (req, res) => {
  // sample body (files is optional)
  // {
  //   "name" : "MJ Whiskey",
  //   "description": "Best Whiskey in town",
  //   "adminId": 1
  //   "files" : <image file selected>
  // }


  try {

    // Upload Image file if it exists
    let imageFile, uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded.');
    }
    else {
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      imageFile = req.files.imageFile;
      uploadPath = 'public/assets/images/' + imageFile.name;

      // Use the mv() method to place the file somewhere on your server
      imageFile.mv(uploadPath, function (err) {
        if (err) {
          //return res.status(500).send(err);
          console.log("Error uploading file: " + err);
        }
        else {
          console.log('Image file uploaded.');
        }

      });
    }

    // Create new whisky in database
    const newWhiskey = await Whisky.create({
      //...req.body,
      name: req.body.name,
      description: req.body.description,
      adminId: req.body.adminId,
      file_name: imageFile? imageFile.name :null
    });

    res.status(200).json(newWhiskey);
  } catch (err) {
    console.log("Error creating new whiskey");
    console.log(err);
    res.status(500).json(err);
  }
});

// Update  whiskey 
//router.put('/', withAuth, async (req, res) => {
// TODO. Add auth
router.put('/', async (req, res) => {
  // sample body
  // {
  //   "id" : 3
  //   "name" : "MJ Whiskey update",
  //   "description": "Best Whiskey in town update",
  // }
  try {
    // Search whiskey by pk 
    const id = req.body.id;
    const whiskey = await Whisky.findByPk(id);
    if (whiskey) {
      console.log("Whisky found for update");
      const whiskyUpdatedData = await whiskey.update({ name: req.body.name, description: req.body.description },)
      if (whiskyUpdatedData) {
        res.status(200).json(JSON.stringify(whiskyUpdatedData));
      }
    }
    else {
      res.status(404).send("Whiskey not Found to update");
    }

  } catch (err) {
    console.log("Error updating new whiskey");
    console.log(err);
    res.status(500).json(err);
  }
});



// Delete whiskey with id
// http://localhost:3001/api/whiskeys/50 (DELETE)
//router.delete('/:id', withAuth, async (req, res) => {
//TODO - readd auth
router.delete('/:id', async (req, res) => {

  let whiskeyId = req.params.id;
  console.log("Deleting whiskey with id: " + whiskeyId);
  try {
    const whiskeyData = await Whisky.destroy({
      where: {
        id: whiskeyId,
      },
    });

    if (!whiskeyData) {
      res.status(404).json({ message: 'No whiskey found with this id!' });
      return;
    }

    res.status(200).json(whiskeyData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
