import { Sitter } from '#domain/entities/sitter.entity.js';
import { DEFAULT_CSV_DELIMITER, INPUT_CSV, OUTPUT_CSV } from '#infrastructure/constants/index.js';
import { CsvSitterRepository } from '#infrastructure/csv/csvSitter.repository.js';
import { jest } from '@jest/globals';

describe('CsvSitterRepository', () => {
    let csv;
    let repository;

    beforeEach(() => {
        csv = {
            read: jest.fn(),
            write: jest.fn(),
        };

        repository = new CsvSitterRepository(csv);
    });

    describe('findAll', () => {
        it('should group ratings by sitter email', async () => {
            csv.read.mockImplementation((_path, callback) => {
                callback({
                    sitter: 'John',
                    sitter_email: 'john@test.com',
                    rating: '5',
                });

                callback({
                    sitter: 'John',
                    sitter_email: 'john@test.com',
                    rating: '4',
                });

                callback({
                    sitter: 'Jane',
                    sitter_email: 'jane@test.com',
                    rating: '3',
                });
            });

            const sitters = await repository.findAll();

            expect(csv.read).toHaveBeenCalledWith(
                INPUT_CSV,
                expect.any(Function),
            );

            expect(sitters).toHaveLength(2);

            expect(sitters[0]).toBeInstanceOf(Sitter);
            expect(sitters[1]).toBeInstanceOf(Sitter);

            expect(sitters[0].email).toBe('john@test.com');
            expect(sitters[0].ratings).toEqual([5, 4]);

            expect(sitters[1].email).toBe('jane@test.com');
            expect(sitters[1].ratings).toEqual([3]);
        });

        it('should return an empty array when csv has no rows', async () => {
            csv.read.mockResolvedValue();

            const sitters = await repository.findAll();

            expect(sitters).toEqual([]);
        });
    });

    describe('printAll', () => {
        it('should write sitter scores to csv', async () => {
            const sitterScores = [
                {
                    toList: jest.fn(() => [
                        'john@test.com',
                        'John',
                        10,
                        8,
                        9,
                    ]),
                },
                {
                    toList: jest.fn(() => [
                        'jane@test.com',
                        'Jane',
                        9,
                        7,
                        8,
                    ]),
                },
            ];

            const consoleSpy = jest
                .spyOn(console, 'log')
                .mockImplementation(() => { });

            await repository.printAll(sitterScores);

            expect(csv.write).toHaveBeenCalledWith(
                OUTPUT_CSV,
                [
                    ['email', 'name', 'profile_score', 'ratings_score', 'search_score'].join(DEFAULT_CSV_DELIMITER),
                    ['john@test.com', 'John', '10', '8', '9'].join(DEFAULT_CSV_DELIMITER),
                    ['jane@test.com', 'Jane', '9', '7', '8'].join(DEFAULT_CSV_DELIMITER),
                ].join('\n'),
            );

            expect(consoleSpy).toHaveBeenCalledWith('[INFO]  (CsvSitterRepository:printAll): generated sitters.csv');

            consoleSpy.mockRestore();
        });
    });
});
