import fs from 'fs';
import { init } from './app.js';

import { calculateFee } from './calculateFee.js';

jest.mock('fs');
jest.mock('./calculateFee.js');

describe('init function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('log an error if no input file path is provided', () => {
    process.argv[2] = undefined;

    console.error = jest.fn();

    init();

    expect(console.error).toHaveBeenCalledWith(
      'ERROR: Path to the input file was not provided'
    );
  });

  test('log an error if reading the input file fails', () => {
    process.argv[2] = 'invalid/path';

    const mockError = new Error('Mock readFile error');
    fs.readFile.mockImplementationOnce((path, options, callback) => {
      callback(mockError);
    });

    console.error = jest.fn();

    init();

    expect(console.error).toHaveBeenCalledWith('Error reading the input file');
  });

  test('log an error if parsing the input file fails', () => {
    process.argv[2] = 'valid/path';

    const mockData = 'invalid JSON';
    fs.readFile.mockImplementationOnce((path, options, callback) => {
      callback(null, mockData);
    });

    console.error = jest.fn();

    init();

    expect(console.error).toHaveBeenCalledWith('Error parsing the input file');
  });

  it('should log the calculated fee for each operation in the input file', () => {
    process.argv[2] = 'valid/path';

    const mockData = '[{"amount": 100},{"amount": 200}]';
    fs.readFile.mockImplementationOnce((path, options, callback) => {
      callback(null, mockData);
    });

    console.log = jest.fn();

    const mockCalculatedFee = 10;
    calculateFee.mockReturnValue(mockCalculatedFee);

    init();

    expect(console.log).toHaveBeenCalledWith(mockCalculatedFee.toFixed(2));
    expect(console.log).toHaveBeenCalledWith(mockCalculatedFee.toFixed(2));
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
