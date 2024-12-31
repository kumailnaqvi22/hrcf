const Collaboration = require('../models/Collaboration');
const sendEmail = require('../utils/sendEmail');

// Submit a collaboration form
exports.submitCollaborationForm = async (req, res) => {
  try {
    const {
      orgName,
      website,
      contactName,
      email,
      phone,
      country,
      collaborationAreas,
      otherArea,
      projectTitle,
      projectDescription,
      expectedOutcomes,
      collaborationType,
      otherCollaboration,
      agreeTerms,
      futureComm,
    } = req.body;

    const supportingDocuments = req.file ? req.file.path : null;

    const collaboration = await Collaboration.create({
      orgName,
      website,
      contactName,
      email,
      phone,
      country,
      collaborationAreas: JSON.parse(collaborationAreas || '[]'),
      otherArea,
      projectTitle,
      projectDescription,
      expectedOutcomes,
      collaborationType: JSON.parse(collaborationType || '[]'),
      otherCollaboration,
      supportingDocuments,
      agreeTerms,
      futureComm,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Collaboration form submitted successfully.',
      collaboration,
    });
  } catch (error) {
    console.error('Error during collaboration submission:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get all collaborations with optional status filter
exports.getCollaborations = async (req, res) => {
  try {
    const { status } = req.query; // Get filter status (e.g., 'pending', 'approved', 'rejected')
    let filter = {};

    // Apply status filter based on query parameter
    if (status) {
      filter = { where: { status } };
    }

    // Fetch collaborations based on filter
    const collaborations = await Collaboration.findAll(filter);

    if (!collaborations.length) {
      return res.status(404).json({ message: "No collaborations found." });
    }

    res.json(collaborations);
  } catch (error) {
    console.error("Error fetching collaborations:", error); // Log actual error for debugging
    res.status(500).json({ error: "Server error" });
  }
};

// Get pending collaborations
exports.getPendingCollaborations = async (req, res) => {
  try {
    const pendingCollaborations = await Collaboration.findAll({ where: { status: 'pending' } });
    res.status(200).json(pendingCollaborations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending collaborations' });
  }
};

// Approve collaboration
exports.approveCollaboration = async (req, res) => {
  const { collaborationId } = req.params;
  try {
    const collaboration = await Collaboration.findByPk(collaborationId);
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }

    if (collaboration.status !== 'pending') {
      return res.status(400).json({ error: 'Collaboration request is not pending' });
    }

    collaboration.status = 'approved';
    await collaboration.save();

    const subject = 'Collaboration Approved';
    const message = `
      Dear ${collaboration.contactName},
      Your collaboration request has been approved. Thank you for your interest in working with us.
      Best Regards,
      The Team
    `;

    await sendEmail(collaboration.email, subject, message);
    res.status(200).json({ message: 'Collaboration approved successfully', collaboration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve collaboration' });
  }
};

// Reject collaboration
exports.rejectCollaboration = async (req, res) => {
  const { collaborationId } = req.params;
  try {
    const collaboration = await Collaboration.findByPk(collaborationId);
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }

    if (collaboration.status !== 'pending') {
      return res.status(400).json({ error: 'Collaboration request is not pending' });
    }

    collaboration.status = 'rejected';
    await collaboration.save();

    const subject = 'Collaboration Rejected';
    const message = `
      Dear ${collaboration.contactName},
      We regret to inform you that your collaboration request has been rejected.
      Best Regards,
      The Team
    `;

    await sendEmail(collaboration.email, subject, message);
    res.status(200).json({ message: 'Collaboration rejected successfully', collaboration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject collaboration' });
  }
};

// Get details of a specific collaboration
exports.getCollaborationDetails = async (req, res) => {
  const { collaborationId } = req.params;
  try {
    const collaboration = await Collaboration.findByPk(collaborationId);
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    res.status(200).json(collaboration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collaboration details' });
  }
};

// Delete a collaboration
exports.deleteCollaboration = async (req, res) => {
  const { collaborationId } = req.params;
  try {
    const collaboration = await Collaboration.findByPk(collaborationId);
    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    await collaboration.destroy();
    res.status(200).json({ message: 'Collaboration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete collaboration' });
  }
};

// Example of routes for `approved` and `rejected`
exports.getApprovedCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.findAll({ where: { status: 'approved' } });

    if (!collaborations.length) {
      return res.status(404).json({ message: "No approved collaborations found." });
    }

    res.json(collaborations);
  } catch (error) {
    console.error("Error fetching approved collaborations:", error); // Log actual error
    res.status(500).json({ error: "Server error" });
  }
};


exports.getRejectedCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.findAll({ where: { status: 'rejected' } });

    if (!collaborations.length) {
      return res.status(404).json({ message: "No rejected collaborations found." });
    }

    res.json(collaborations);
  } catch (error) {
    console.error("Error fetching rejected collaborations:", error); // Log actual error
    res.status(500).json({ error: "Server error" });
  }
};
