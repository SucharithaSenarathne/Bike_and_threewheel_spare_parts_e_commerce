// routes/api/itemRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const itemController = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), itemController.addItem);

router.get('/', itemController.getAllItems);

router.get('/:id', itemController.getItemById);

router.put('/:id', itemController.updateItem);

router.delete('/:id', itemController.deleteItem);

router.post('/:itemId/review',auth(), itemController.postReview);

module.exports = router;
