import { DEFAULT_CSV_DELIMITER } from '#infrastructure/constants/index.js';
import csv from 'csv-parser';
import { createReadStream, createWriteStream } from 'fs';

export class CsvFileAdapter {

    /**
     * Reads a CSV File and returns value on every row
     *
     * @param {*} path
     * @param {*} onRead
     * @returns data from csv
     */
    read(path, onRead) {
        return new Promise((resolve, reject) => {
            createReadStream(path)
                .pipe(csv({ separator: DEFAULT_CSV_DELIMITER }))
                .on('data', onRead)
                .on('end', resolve)
                .on('error', reject);
        });
    }

    /**
     * Creates a file wit the content
     *
     * @param {*} path where file will be located
     * @param {*} data content to inject into file
     * @returns stream writes a file with the content injected
     */
    write(path, data) {
        return new Promise((resolve, reject) => {
            const stream = createWriteStream(path);

            stream.on('error', reject);
            stream.on('finish', resolve);

            stream.write(data);
            stream.end();
        });
    }
}
