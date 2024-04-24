import fs from 'fs';

import { calculateFee } from './calculateFee.js';

export const init = () => {
  const inputFilePath = process.argv[2];

  if (!inputFilePath) {
    console.error('ERROR: Path to the input file was not provided');

    return;
  }

  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the input file');

      return;
    }

    try {
      const operations = JSON.parse(data);

      for (const operation of operations) {
        const fee = calculateFee(operation);

        console.log(fee.toFixed(2));
      }
    } catch (error) {
      console.error('Error parsing the input file');
    }
  });
};

init();
