import { Sitter } from '#domain/entities/sitter.entity.js';
import { SitterRepository } from '#domain/repository/sitter.repository.js';
import { DEFAULT_CSV_DELIMITER, INPUT_CSV, OUTPUT_CSV } from '#infrastructure/constants/index.js';
import { logMessage } from '#utils/logger.util.js';

export class CsvSitterRepository extends SitterRepository {

    constructor(csvFileAdapter) {
        super();
        this.csvFileAdapter = csvFileAdapter;
    }

    /**
     * Gets all Sitters Ratings stored from csv
     *
     * @returns Sitters with Rating History
     */
    async findAll() {
        const sittersObj = {};
        await this.csvFileAdapter.read(INPUT_CSV, (row) => {
            const { rating, sitter_email, sitter } = row;
            if (!sittersObj[sitter_email]) {
                sittersObj[sitter_email] = new Sitter(
                    sitter,
                    sitter_email,
                );
            }
            sittersObj[sitter_email].addRating(+rating);
        });
        return Object.values(sittersObj);
    }

    async printAll(sitterScores) {
        const headers = [
            'email',
            'name',
            'profile_score',
            'ratings_score',
            'search_score',
        ];

        const rows = sitterScores.map((e) => e.toList());

        const csv = [
            headers.join(DEFAULT_CSV_DELIMITER),
            ...rows.map(row => row.join(DEFAULT_CSV_DELIMITER)),
        ].join('\n');

        await this.csvFileAdapter.write(OUTPUT_CSV, csv);

        logMessage('CsvSitterRepository', 'printAll', 'generated sitters.csv');

    };

}
