// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import 'dotenv/config';
// import connectDB from './configuration/mongodb.js';
// import HealthProgram from './models/healthProgram.js';
// import Client from './models/client.js';
// import Enrollment from './models/enrollment.js';
// import { isValid, parseISO } from 'date-fns';

// const app = express();
// const port = process.env.PORT || 4000;
// connectDB();

// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// // 1. Create a health program
// app.post('/api/programs', async (req, res) => {
//     const { name } = req.body;

//     if (!name || typeof name !== 'string') {
//         return res.status(400).json({ error: 'Program name is required and must be a string.' });
//     }

//     try {
//         const newProgram = new HealthProgram({ name });
//         const savedProgram = await newProgram.save();
//         res.status(201).json(savedProgram);
//     } catch (error) {
//         console.error("Error creating program:", error);
//         res.status(500).json({ error: 'Failed to create program.' });
//     }
// });

// // 2. Register a new client
// // 2. Register a new client
// app.post('/api/clients', async (req, res) => {
//     const { firstName, lastName, dateOfBirth, gender, contactNumber, address } = req.body;
//     let parsedDate; // Declare parsedDate outside the if-else block

//     if (!firstName || !lastName || !dateOfBirth || !gender || !contactNumber || !address) {
//         return res.status(400).json({ error: 'All client fields are required.' });
//     }
//     if (typeof firstName !== 'string' || typeof lastName !== 'string') {
//         return res.status(400).json({ error: 'First and last names must be strings.' });
//     }

//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (typeof dateOfBirth !== 'string' || !dateRegex.test(dateOfBirth)) {
//         return res.status(400).json({ error: 'Invalid date format. Use`-MM-DD`.' });
//     }
//     else {
//         console.log('Regex test passed (in else):', dateOfBirth); // Add this log
//         parsedDate = new Date(dateOfBirth);
//         console.log('Parsed Date:', parsedDate);
//         console.log('isNaN(parsedDate.getTime()):', isNaN(parsedDate.getTime()));
//         if (isNaN(parsedDate.getTime())) {
//             return res.status(400).json({ error: 'Invalid date value' });
//         }
//     }

//     if (typeof gender !== 'string') {
//         return res.status(400).json({ error: 'Gender must be a string' });
//     }
//     if (typeof contactNumber !== 'string') {
//         return res.status(400).json({ error: 'Contact Number must be a string' });
//     }
//     if (typeof address !== 'string') {
//         return res.status(400).json({ error: 'Address must be a string' });
//     }

//     try {
//         const newClient = new Client({
//             firstName,
//             lastName,
//             dateOfBirth: parsedDate,
//             gender,
//             contactNumber,
//             address,
//         });
//         const savedClient = await newClient.save();
//         res.status(201).json(savedClient);
//     } catch (error) {
//         console.error("Error creating client:", error);
//         res.status(500).json({ error: 'Failed to create client.' });
//     }
// });

// // GET all clients
// app.get('/api/clients', async (req, res) => {
//     try {
//         const allClients = await Client.find();
//         res.status(200).json(allClients);
//     } catch (error) {
//         console.error("Error getting clients:", error);
//         res.status(500).json({ error: 'Failed to retrieve clients.' });
//     }
// });

// // 3. Enroll a client in one or more programs
// app.post('/api/enrollments', async (req, res) => {
//     const { clientId, programIds } = req.body;

//     try {
//         const client = await Client.findById(clientId);
//         if (!client) {
//             return res.status(404).json({ error: 'Client not found' });
//         }

//         const programs = await HealthProgram.find({ _id: { $in: programIds } });
//         if (programs.length !== programIds.length) {
//             return res.status(400).json({ error: 'One or more programs not found' });
//         }

//         const programDetails = programs.map(p => ({
//             id: p._id,
//             name: p.name
//         }));

//         let enrollment = await Enrollment.findOne({ clientId });
//         if (enrollment) {
//             enrollment.programIds = programIds;
//             enrollment.programs = programDetails;
//         } else {
//             enrollment = new Enrollment({
//                 clientId,
//                 programIds,
//                 programs: programDetails
//             });
//         }

//         await enrollment.save();
//         res.status(200).json(enrollment);

//     } catch (error) {
//         console.error('Enrollment error:', error);
//         res.status(500).json({ error: 'Failed to process enrollment' });
//     }
// });

// // 4. Get all enrollments (optional, for admin views etc.)
// app.get('/api/enrollments', async (req, res) => {
//     try {
//         const allEnrollments = await Enrollment.find().populate('clientId', 'firstName lastName').populate('programs.id', 'name');
//         res.status(200).json(allEnrollments);
//     } catch (error) {
//         console.error("Error getting enrollments:", error);
//         res.status(500).json({ error: 'Failed to retrieve enrollments.' });
//     }
// });

// // 5. View a client's profile, including the programs they are enrolled in
// app.get('/api/clients/:clientId', async (req, res) => {
//     try {
//         const client = await Client.findById(req.params.clientId);
//         if (!client) return res.status(404).json({ error: 'Client not found' });

//         const enrollment = await Enrollment.findOne({ clientId: req.params.clientId });

//         const enrolledProgramsData = enrollment ? enrollment.programs : [];

//         res.json({
//             client,
//             enrolledPrograms: enrolledProgramsData.map(p => ({ id: p.id, name: p.name }))
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // 6. Get all health programs
// app.get('/api/programs', async (req, res) => {
//     try {
//         const allPrograms = await HealthProgram.find();
//         res.status(200).json(allPrograms);
//     } catch (error) {
//         console.error("Error getting programs:", error);
//         res.status(500).json({ error: 'Failed to retrieve programs.' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configuration/mongodb.js';
import HealthProgram from './models/healthProgram.js';
import Client from './models/client.js';
import Enrollment from './models/enrollment.js';
import { isValid, parseISO } from 'date-fns';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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
    let parsedDate;

    if (!firstName || !lastName || !dateOfBirth || !gender || !contactNumber || !address) {
        return res.status(400).json({ error: 'All client fields are required.' });
    }
    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
        return res.status(400).json({ error: 'First and last names must be strings.' });
    }

    try {
        parsedDate = parseISO(dateOfBirth);
        if (!isValid(parsedDate)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
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

// GET all clients
app.get('/api/clients', async (req, res) => {
    try {
        const allClients = await Client.find();
        res.status(200).json(allClients);
    } catch (error) {
        console.error("Error getting clients:", error);
        res.status(500).json({ error: 'Failed to retrieve clients.' });
    }
});

// 3. Enroll a client in one or more programs ;
// 3. Enroll a client in one or more programs
app.post('/api/enrollments', async (req, res) => {
    const { clientId, programIds } = req.body;

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const programsExist = await HealthProgram.find({ _id: { $in: programIds } });
        if (programsExist.length !== programIds.length) {
            return res.status(400).json({ error: 'One or more programs not found' });
        }

        let enrollment = await Enrollment.findOne({ clientId });
        if (enrollment) {
            enrollment.programs = programIds; // Assign the array of ObjectIds directly
        } else {
            enrollment = new Enrollment({
                clientId,
                programs: programIds // Assign the array of ObjectIds directly
            });
        }

        await enrollment.save();
        res.status(200).json(enrollment);

    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ error: 'Failed to process enrollment' });
    }
});
// 4. Get all enrollments (optional, for admin views etc.)
app.get('/api/enrollments', async (req, res) => {
    try {
        const allEnrollments = await Enrollment.find().populate('clientId', 'firstName lastName').populate('programs.id', 'name');
        res.status(200).json(allEnrollments);
    } catch (error) {
        console.error("Error getting enrollments:", error);
        res.status(500).json({ error: 'Failed to retrieve enrollments.' });
    }
});

// 5. View a client's profile, including the programs they are enrolled in
app.get('/api/clients/:clientId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) return res.status(404).json({ error: 'Client not found' });

        const enrollment = await Enrollment.findOne({ clientId: req.params.clientId });

        const enrolledProgramsData = enrollment ? enrollment.programs : [];

        res.json({
            client,
            enrolledPrograms: enrolledProgramsData.map(p => ({ id: p.id, name: p.name }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Get all health programs
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