import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_URL = 'http://localhost:5000/api/upload';

async function testUpload(fileName, isValidType) {
    console.log(`\nTesting ${fileName} (Expected: ${isValidType ? 'Success' : 'Failure'})`);

    //const filePath = path.join(__dirname, fileName);

    // Create dummy file
    const filePath = path.join(__dirname, 'real.mp4');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", result);

        if (!isValidType && response.status !== 200) {
            console.log("✅ Correctly rejected invalid file.");
        } else {
            console.log("✅ Passed validation check.");
        }

    } catch (error) {
        console.error("Request failed:", error);
    } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}

async function runTests() {
    console.log("Starting tests...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await testUpload('test.txt', false);
    await testUpload('test.mp3', true);
}

runTests();