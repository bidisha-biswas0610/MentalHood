const { spawn } = require('child_process');

// Function to interact with LLaMA (using Ollama CLI for example)
async function infer(prompt) {
  return new Promise((resolve, reject) => {
    const process = spawn('ollama', ['run', 'llama3.1:8b', prompt]);

    let response = '';
    process.stdout.on('data', (data) => {
      response += data.toString();
    });

    process.stderr.on('data', (data) => {
      console.error('Error:', data.toString());
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(response.trim());
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

module.exports = { infer };
