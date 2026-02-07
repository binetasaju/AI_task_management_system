
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_URL = 'http://localhost:5000/api/upload';

async function testUpload(fileName, isValidType) {
    console.log(`\nTesting upload for ${fileName} (Expected: ${isValidType ? 'Success' : 'Failure'})...`);

    // Create dummy file
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, 'dummy content');

    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: isValidType ? 'audio/mpeg' : 'text/plain' });
    formData.append('file', fileBlob, fileName);

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log(`Response Status: ${response.status}`);
        console.log(`Response Body:`, result);

        if (!isValidType) {
            if (response.status !== 200 && result.success === false && result.message.includes('Invalid file type')) {
                console.log('✅ Correctly rejected invalid file type.');
            } else {
                console.log('❌ UNEXPECTED: Should have rejected invalid file type.');
            }
        } else {
            // Since we likely don't have a valid API Key or the file is dummy, we expect a failure but NOT "Invalid file type"
            if (result.message && (result.message.includes('API Key') || result.message.includes('Transcription failed'))) {
                console.log('✅ Passed file type check (failed at OpenAI step as expected for dummy environment).');
            } else if (result.success) {
                console.log('✅ Unexpected success (did you have a key? good job).');
            } else if (result.message.includes('Invalid file type')) {
                console.log('❌ FAILED: Valid file type was rejected.');
            } else {
                console.log('⚠️  Ambiguous result.');
            }
        }

    } catch (error) {
        console.error('Request failed:', error);
    } finally {
        // Cleanup
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}

async function runTests() {
    // Wait a bit for server to pick up changes if restarting
    console.log("Starting tests...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await testUpload('test.txt', false);
    await testUpload('test.mp3', true);
}

runTests();
