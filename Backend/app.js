import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configuration/mongodb.js'
import HealthProgram from './models/healthProgram.js'
import Client from './models/client.js'
import Enrollment from './models/enrollment.js'

//app config
const app = express()
const port = process.env.PORT || 4000;
connectDB()
//middlewares
app.use(express.json())
app.use(cors())

app.use(bodyParser.json());

// Routes.......

    // 1. Create a health program
    app.post('/api/programs', async (req, res) => {
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Program name is required and must be a string.' });
        }

        try {
            const newProgram = new HealthProgram({ name });
            const savedProgram = await newProgram.save();
            res.status(201).json(savedProgram);
        } catch (error) {
            console.error("Error creating program:", error);
            res.status(500).json({ error: 'Failed to create program.' });
        }
    });

    // 2. Register a new client
    app.post('/api/clients', async (req, res) => {
        const { firstName, lastName, dateOfBirth, gender, contactNumber, address } = req.body;

        if (!firstName || !lastName || !dateOfBirth || !gender || !contactNumber || !address) {
            return res.status(400).json({ error: 'All client fields are required.' });
        }
        if (typeof firstName !== 'string' || typeof lastName !== 'string') {
            return res.status(400).json({ error: 'First and last names must be strings.' });
        }

        // Basic date format validation (YYYY-MM-DD) -  Improve this for real apps
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof dateOfBirth !== 'string' || !dateRegex.test(dateOfBirth)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }
        const parsedDate = new Date(dateOfBirth); // Convert date string to Date object
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date value' });
        }
        if (typeof gender !== 'string') {
            return res.status(400).json({ error: 'Gender must be a string' });
        }
        if (typeof contactNumber !== 'string') {
            return res.status(400).json({ error: 'Contact Number must be a string' });
        }
        if (typeof address !== 'string') {
            return res.status(400).json({ error: 'Address must be a string' });
        }

        try {
            const newClient = new Client({
                firstName,
                lastName,
                dateOfBirth: parsedDate,
                gender,
                contactNumber,
                address,
            });
            const savedClient = await newClient.save();
            res.status(201).json(savedClient);
        } catch (error) {
            console.error("Error creating client:", error);
            res.status(500).json({ error: 'Failed to create client.' });
        }
    });


   // 3. Enroll a client in one or more programs

app.post('/api/enrollments', async (req, res) => {
    const { clientId, programIds } = req.body;

    try {
        // Validate client exists
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Validate programs exist
        const programs = await HealthProgram.find({ _id: { $in: programIds } });
        if (programs.length !== programIds.length) {
            return res.status(400).json({ error: 'One or more programs not found' });
        }

        // Prepare program details
        const programDetails = programs.map(p => ({
            id: p._id,
            name: p.name
        }));

        // Update or create enrollment
        let enrollment = await Enrollment.findOne({ clientId });
        if (enrollment) {
            // Update existing enrollment
            enrollment.programIds = programIds;
            enrollment.programs = programDetails;
        } else {
            // Create new enrollment
            enrollment = new Enrollment({
                clientId,
                programIds,
                programs: programDetails
            });
        }

        await enrollment.save();
        res.status(200).json(enrollment);
        
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Failed to process enrollment' });
    }
});

    // 5. View a client's profile, including the programs they are enrolled in
    // Updated endpoint in app.js
app.get('/api/clients/:clientId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) return res.status(404).json({ error: 'Client not found' });

        // Get all enrollments for this client
        const enrollments = await Enrollment.find({ clientId: req.params.clientId })
            .populate('programs', 'name'); // Populate program details

        res.json({
            client,
            enrolledPrograms: enrollments.flatMap(e => 
                e.programs.map(p => ({ id: p._id, name: p.name }))
            )
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all health programs (GET route)
app.get('/api/programs', async (req, res) => {
    try {
        const allPrograms = await HealthProgram.find();
        res.status(200).json(allPrograms);
    } catch (error) {
        console.error("Error getting programs:", error);
        res.status(500).json({ error: 'Failed to retrieve programs.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
