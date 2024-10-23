const Item = require('../models/Items');


exports.addItem = async (req, res) => {
    const { name, brand, cost, description, category,stock, subcategory } = req.body;
    const image = req.file.path;

    try {
        const newItem = new Item({
            name,
            cost,
            description,
            category,
            stock,
            subcategory,
            brand,
            image
        });

        const item = await newItem.save();
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('reviews.user', 'fname lname profilePicture');;
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.postReview = async (req, res) => {
    const { itemId } = req.params;
    const { reviewText, rating } = req.body;

    const numericalRatings = {
        'Terrible': 1,
        'Bad': 2,
        'Ok': 3,
        'Good': 4,
        'Excellent': 5
    };
    
    const numericalRating = numericalRatings[rating];

    if (!numericalRating) {
        return res.status(400).json({ message: 'Invalid rating value' });
    }

    const review = {
            user: req.user.id,
            reviewText,
            rating,
            numericalRating
    };

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.reviews.push(review);
        await item.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, cost, description, category, stock, subcategory, brand } = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { name, cost, description, category, stock, subcategory, brand },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
