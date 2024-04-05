const router = require('express').Router();
const fs = require('fs');
const { Whisky, Rating } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');

const Sequelize = require('sequelize');

// Object for whiskey data avg rating and comments
class WhiskeyData {
  constructor(name, avgRating, comments, id) {
    this.name = name;
    this.avgRating = avgRating;
    this.comments = comments;
    this.id = id;
  }
}

// Get whiskey summary data for each whiseky which includes the avg rating and an array of all the comments
function getWhiskySummaryData(whiskey) {
  let whiskeyData;
  let ratingCount = 0;
  let ratingTotal = 0;
  let avgRating = 0;
  let comments = new Array();
  whiskey.ratings.forEach((rating) => {
    ratingTotal += rating.rating;
    ratingCount += 1;
    comments.push(rating.comment);
  })
  if (ratingCount > 0) {
    avgRating = (ratingTotal / ratingCount).toFixed(2);
  }
  whiskeyData = new WhiskeyData(whiskey.name, avgRating, comments, whiskey.id);
  console.log("Whiskey data summary: " + JSON.stringify(whiskeyData));
  return whiskeyData;
}

// Get all whiskeys with avg rating
router.get('/averages', async (req, res) => {
  //TODO - Add auth
  let whiskeyDataSummary = new Array();
  try {
    let allWhiskyData = await Whisky.findAll({
      // This will retrieve every Whisky's associated Rating data.  
      include: [{ model: Rating }],
    });
    if (allWhiskyData) {
      allWhiskyData.forEach((whiskey) => {
        whiskeyDataSummary.push(getWhiskySummaryData(whiskey));
      })
    }

    // console.log("whiskeyDataSummary from whiskey routes: " + JSON.stringify(whiskeyDataSummary, null, 2));


    res.status(200).json(whiskeyDataSummary);
    // res.render('profile', {
    //   whiskeyDataSummary
    // });
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving whisky data summary");
  }

})

// Get all whiskeys
router.get('/', async (req, res) => {
  //TODO - Add auth
  try {
    let whiskyData = await Whisky.findAll({
      // This will retrieve every Whisky's associated Rating data.  
      include: [{ model: Rating }],
    });
    if (whiskyData) {
      res.status(200).json(JSON.stringify(whiskyData));
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving whisky data");
  }


})
// Search whiskey by id
// http://localhost:3001/api/whiskeys/15

router.get('/:id', async (req, res) => {
  //TODO - Add auth
  let whiskeyId = req.params.id;
  console.log("Search for whiskey with id " + whiskeyId);
  try {
    // Search whiskey by name 
    const whiskeyData = await Whisky.findByPk(whiskeyId);

    if (whiskeyData) {

      // first read the image and base64Encode the file IF image file name exists. Note
      // the image blob is not stored in the database
      // if (whiskeyData.file_name){
      //   console.log("Base 64 encode file");
      //   var imageAsBase64 = fs.readFileSync(path.join(__dirname,"../../public/assets/images/" + whiskeyData.file_name), 'base64');
      //   whiskeyData.image = imageAsBase64;
      //   console.log("Base 64 encoded file: " + whiskeyData.image);

      // }
      //res.status(200).json(JSON.stringify(whiskeyData));
      res.sendFile(path.join(__dirname, '../../public/assets/images/' + whiskeyData.file_name));

    }
    else {
      console.log("Whisky not found");
      res.status(404).send("Whiskey not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error searching whikey by id");
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

// Search whiskey by name
// http://localhost:3001/api/whiskeys/John

router.get('/name/:name', async (req, res) => {
  //TODO - Add auth
  let whiskyName = req.params.name;
  console.log("Search for " + whiskyName);
  try {
    // Search whiskey by name 
    const whiskeyData = await Whisky.findAll({ where: { name: { [Sequelize.Op.like]: whiskyName + "%" } } });

    if (whiskeyData) {

      // first read the image and base64Encode the file IF image file name exists. Note
      // the image blob is not stored in the database
      if (whiskeyData.file_name) {
        console.log("Base 64 encode file");
        var imageAsBase64 = fs.readFileSync(path.join(__dirname, "../../public/assets/images/" + whiskeyData.file_name), 'base64');
        whiskeyData.image = imageAsBase64;
        console.log("Base 64 encoded file: " + whiskeyData.image);

      }
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
      file_name: imageFile ? imageFile.name : null
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
