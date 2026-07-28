import { promises as fs } from 'fs';

import { CsvFileAdapter } from '#infrastructure/csv/csvFile.adapter.js';

const CSV_TEST_PATH = 'data/test.csv';
describe('CsvFileAdapter', () => {
    let csvFileAdapter;

    beforeAll(() => {
        csvFileAdapter = new CsvFileAdapter();
    });

    it('write() and read() should create and read csv files', async () => {
        const content = [
            'name',
            'John',
            'Carter',
        ].join('\n');

        await csvFileAdapter.write(CSV_TEST_PATH, content);

        const rows = [];
        await csvFileAdapter.read(CSV_TEST_PATH, row => rows.push(row));

        expect(rows).toEqual([
            {
                name: 'John',
            },
            {
                name: 'Carter',
            },
        ]);

        await fs.unlink(CSV_TEST_PATH);
    });
});
