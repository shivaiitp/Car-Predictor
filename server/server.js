import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// --- More robust path handling ---
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8000;
const upload = multer();

app.use(cors());
app.use(express.json());

app.get('/data', (req, res) => {
    const results = {
        companies: new Set(),
        car_models: new Set(),
        years: new Set(),
        fuel_types: new Set(),
    };

    // Build path relative to the current script's directory
    const csvPath = path.join(__dirname, '..', 'Cleaned_Car_data.csv');

    createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
            if (row.company) results.companies.add(row.company);
            if (row.name) results.car_models.add(row.name);
            if (row.year) results.years.add(row.year);
            if (row.fuel_type) results.fuel_types.add(row.fuel_type);
        })
        .on('end', () => {
            const sortedData = {
                companies: Array.from(results.companies).sort(),
                car_models: Array.from(results.car_models).sort(),
                years: Array.from(results.years).sort((a, b) => b - a),
                fuel_types: Array.from(results.fuel_types),
            };
            res.json(sortedData);
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            res.status(500).send('Error processing car data');
        });
});

app.post('/predict', upload.none(), (req, res) => {
    const { company, car_models, year, fuel_type, kilo_driven } = req.body;

    if (!company || !car_models || !year || !fuel_type || !kilo_driven) {
        return res.status(400).send('Error: Missing form data.');
    }

    // Build path relative to the current script's directory
    const scriptPath = path.join(__dirname, '..', 'predict.py');

    const pythonProcess = spawn('python', [
        scriptPath,
        car_models,
        company,
        year,
        kilo_driven,
        fuel_type
    ]);

    let prediction = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
        prediction += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
        console.error(`Node Script Error: ${error}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0 || error) {
            console.error(`Node script exited with code ${code}`);
            return res.status(500).send(error || 'Failed to get prediction from model.');
        }
        res.send(prediction.trim());
    });
});

app.listen(port, () => {
    console.log(`Node.js backend server running at http://localhost:${port}`);
});
