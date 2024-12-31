const Donation = require('../models/Donation');

// Create a new donation entry
exports.createDonation = async (req, res) => {
    const {
        amount,
        donationType,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zip,
        country,
        isAnonymous,
        tools,
        materials,
        paymentMethod,
        upiId,
    } = req.body;

    try {
        const donation = await Donation.create({
            amount,
            donationType,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zip,
            country,
            isAnonymous,
            tools: tools || null,
            materials: materials || null,
            paymentMethod,
            upiId: paymentMethod === 'upi' ? upiId : null,
        });

        res.status(201).json({
            success: true,
            message: 'Donation recorded successfully!',
            data: donation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to record donation', error: error.message });
    }
};

// Get all donations
exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.findAll();
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
};

// Get details of a specific donation
exports.getDonationDetails = async (req, res) => {
    const { donationId } = req.params;
    try {
        const donation = await Donation.findByPk(donationId);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.status(200).json(donation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donation details' });
    }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
    const { donationId } = req.params;
    try {
        const donation = await Donation.findByPk(donationId);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        await donation.destroy();
        res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete donation' });
    }
}; 
