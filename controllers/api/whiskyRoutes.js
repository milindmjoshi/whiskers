const router = require('express').Router();
const { Project } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');

//TODO: - Update to Whisky ROUTES //

router.get('/:name',  (req,res) => {
    //TODO - Add auth
    let whisky = req.params.name;
    switch(whisky) {
      case 'chivas-12': 
            res.sendFile(path.join(__dirname, '../../public/assets/images/chivas-regal-12.jpg'));
            break;
      case 'chivas-18':
            res.sendFile(path.join(__dirname,'../../public/assets/images/chivas-regal-18.jpg'));
            break;
      case  'chivas-25':
            res.sendFile(path.join(__dirname,'../../public/assets/images/chivas-regal-25.jpg'));
            break;
      default:
            console.log("Whisky not found:" + whisky);
            res.status(404).send('Whisky Not Found: ' + whisky);     
    }

})

router.post('/', withAuth, async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
