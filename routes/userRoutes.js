const express = require('express');
const { registerUser, loginUser, googleLogin, getAllUsers, updateAddress, deleteUser,updateIsAdminStatus, deleteAddress, getCurrentUserDetails, updatePassword, updatePicture, addAddress, updateUserDetails,requestPasswordReset,resetPassword } = require('../controllers/userContoller');
const auth = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
  
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

router.get('/allusers',auth(), getAllUsers);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/google-login', googleLogin);

router.get('/me', auth(), getCurrentUserDetails);

router.put('/update', auth(),[
    check('fname', 'First name is required').optional().not().isEmpty(),
    check('lname', 'Last name is required').optional().not().isEmpty(),
    check('contactNo', 'Mobile number is required').optional().not().isEmpty()
  ], updateUserDetails);

router.put('/update-password', auth(), updatePassword);

router.put('/update-profile-picture', auth(), upload.single('profilePicture'), updatePicture );

router.post('/address', auth(), addAddress);

router.put('/address/:addressId', auth(), updateAddress);

router.delete('/address/:addressId', auth(), deleteAddress);

router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], requestPasswordReset);

router.get('/reset-password/:id/:token', resetPassword);

router.delete('/delete/:id', deleteUser);

router.put('/update-admin-status/:id', updateIsAdminStatus);

module.exports = router;
