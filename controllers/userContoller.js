const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
    const { fname, lname, address, contactNo, dateofbirth, isAdmin, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email address' });
    }

    if (password.length < 8) {
        return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            fname,
            lname,
            address,
            contactNo,
            dateofbirth,
            isAdmin: isAdmin || false,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);


        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Wickramasinghe Motors',
            text: `Hi ${user.fname},\n\nThank you for registering on our platform!`
        };

        await transporter.sendMail(mailOptions);

        const payload = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { fname: user.fname, lname: user.lname, email: user.email } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ user: { id: user._id, isAdmin: user.isAdmin } }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                fname: name.split(' ')[0],
                lname: name.split(' ')[1],
                email,
                password: '',
                avatar: picture,
                address: 'Default Address',
                contactNo: '0000000000',
                dateofbirth: new Date(),
            });

            await user.save();
        }

        const token = jwt.sign({ user: { id: user._id, isAdmin: user.isAdmin } }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getCurrentUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');;

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user details:', err.message);
        res.status(500).send('Server error');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        if (!users || users.length === 0) {
            console.log('No users found');
            return res.status(404).json({ msg: 'No users found' });
        }

        res.json(users);
    } catch (err) {
        console.error('Error fetching all users:', err.message);
        res.status(500).send('Server error');
    }
};

const updateUserDetails = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fname, lname, contactNo } = req.body;
    let updatedFields = { fname, lname, contactNo };

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        Object.keys(updatedFields).forEach(field => {
            if (updatedFields[field]) {
              user[field] = updatedFields[field];
            }
        });

        await user.save();

        res.json({ msg: 'User details updated successfully', user });

    } catch (err) {
        console.error('Error updating user details:', err.message);
        res.status(500).send('Server error');
    }
};

const addAddress = async (req, res) => {
    const { name, address, city, state, zip, contactNo } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newAddress = {
            name,
            address,
            city,
            state,
            zip,
            contactNo
        };

        user.addresses.push(newAddress);

        await user.save();

        res.status(201).json({ msg: 'Address added successfully', addresses: user.addresses });
    } catch (err) {
        console.error('Error adding address:', err.message);
        res.status(500).send('Server error');
    }
};

const updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const { name, address, city, state, zip, contactNo } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const addressToUpdate = user.addresses.id(addressId);
        if (!addressToUpdate) {
            return res.status(404).json({ msg: 'Address not found' });
        }

        addressToUpdate.name = name || addressToUpdate.name;
        addressToUpdate.address = address || addressToUpdate.address;
        addressToUpdate.city = city || addressToUpdate.city;
        addressToUpdate.state = state || addressToUpdate.state;
        addressToUpdate.zip = zip || addressToUpdate.zip;
        addressToUpdate.contactNo = contactNo || addressToUpdate.contactNo;

        await user.save();
        
        res.status(200).json({ msg: 'Address updated successfully', addresses: user.addresses });
    } catch (err) {
        console.error('Error updating address:', err.message);
        res.status(500).send('Server error');
    }
};

const deleteAddress = async (req, res) => {
    const { addressId } = req.params;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const addressToDelete = user.addresses.id(addressId);
        if (!addressToDelete) {
            return res.status(404).json({ msg: 'Address not found' });
        }
        user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);
        await user.save();

        res.status(200).json({ msg: 'Address deleted successfully', addresses: user.addresses });
    } catch (err) {
        console.error('Error deleting address:', err.message);
        res.status(500).send('Server error');
    }
};

const updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid current password' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};

const updatePicture =  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      user.profilePicture = req.file.path;
  
      await user.save();
  
      res.json({ msg: 'Profile picture updated successfully', profilePicture: user.profilePicture });
    } catch (err) {
      console.error('Error updating profile picture:', err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'No user found with that email address' });
        }

        const secret = process.env.JWT_SECRET + user.password;
        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '1h' });
        const link = `https://wickramasinghemotors.onrender.com/api/users/reset-password/${user._id}/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            text: `Hi ${user.fname},\n\nPlease use the following link to reset your password:\n${link}\n\nThis link will expire in 1 hour.\nIf you didn't request this, please ignore this email.\n\nBest regards,\nYour Team`
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Password reset link sent to your email' });
    } catch (err) {
        console.error('Error requesting password reset:', err.message);
        res.status(500).send('Server error');
    }
};

const resetPassword = async (req, res) => {
    const { id, token } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid user or token' });
        }

        const secret = process.env.JWT_SECRET + user.password;

        // Verify the JWT token
        try {
            const decoded = jwt.verify(token, secret);
            if (decoded.id !== user._id.toString()) {
                return res.status(400).json({ msg: 'Invalid or expired token' });
            }

            // If we reach this point, the token is valid.
            // Respond with a success message and prompt the client to show the form.
            return res.status(200).json({ msg: 'Token verified, please enter a new password.' });
        } catch (err) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

    } catch (err) {
        console.error('Error resetting password:', err.message);
        return res.status(500).send('Server error');
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).send('Server error');
    }
};

const updateIsAdminStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isAdmin = req.body.isAdmin;  // Expecting a boolean from req.body
        await user.save();

        res.json({ msg: `User isAdmin status updated to ${user.isAdmin}` });
    } catch (err) {
        console.error('Error updating isAdmin status:', err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { registerUser, deleteUser,updateIsAdminStatus, loginUser, getAllUsers, resetPassword, requestPasswordReset, googleLogin, getCurrentUserDetails, updatePassword, deleteAddress, updateAddress, updatePicture, updateUserDetails, addAddress };
