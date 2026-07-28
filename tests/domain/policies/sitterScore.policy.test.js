import { SitterScorePolicy } from '#domain/policies/sitterScore.policy.js';

describe('SitterScorePolicy', () => {

    let sitterScorePolicy;

    beforeAll(() => {
        sitterScorePolicy = new SitterScorePolicy();
    });

    describe('calculateProfileScore()', () => {

        it("when sitter's name is 'Leilani R.', return profile score 1.15", () => {
            const result = sitterScorePolicy.calculateProfileScore('Leilani R.');
            expect(result).toBe(1.15);
        });

        it("when sitter's name is empty, return zero", () => {
            const result = sitterScorePolicy.calculateProfileScore('');
            expect(result).toBe(0);
        });

        it("when sitter's name has blank spaces & points, return score based on distinct letters", () => {
            const result = sitterScorePolicy.calculateProfileScore('R . M');
            expect(result).toBe(0.38);
        });

        it("when sitter's name is 'aaaaAAA', return profile score 0.19", () => {
            const result = sitterScorePolicy.calculateProfileScore('aaaaAAA');
            expect(result).toBe(0.19);
        });
    });

    describe('calculateRatingScore()', () => {
        it('when #stays is zero, return zero', () => {
            const result = sitterScorePolicy.calculateRatingScore([]);
            expect(result).toBe(0);
        });

        it('when #stays are greater than zero, return avg', () => {
            const result = sitterScorePolicy.calculateRatingScore([2, 4, 6, 8]);
            expect(result).toBe(5);
        });
    });

    describe('calculateSearchScore()', () => {
        const expectedScoreHistory = [
            2.50,
            2.75,
            3.00,
            3.25,
            3.50,
            3.75,
            4.00,
            4.25,
            4.50,
            4.75,
            5.00,
            5.00,
            5.00,
        ];

        expectedScoreHistory.forEach((expectedScore, stay) =>
            it(`when sitter has #${stay} stay(s) (all 5 rate) and Profile Score is 2.5, should return ${expectedScore}`, () => {
                const ratings = Array(stay).fill(5);
                const ratingScore = sitterScorePolicy.calculateRatingScore(ratings);

                const result = sitterScorePolicy.calculateSearchScore({
                    profileScore: 2.5,
                    ratingScore,
                    stays: ratings?.length,
                });
                expect(result).toBe(expectedScore);
            }),
        );
    });

    describe('calculateSitterScores()', () => {
        it('when sitter has name and no ratings, Search Score is equal to Profile Score and Rating Score is 0', () => {
            const { ratingScore, searchScore, profileScore } = sitterScorePolicy.calculateScores({ name: 'John', ratings: [] });

            expect(searchScore).toEqual(profileScore);
            expect({ profileScore, ratingScore, searchScore }).toMatchObject({
                profileScore: 0.77,
                ratingScore: 0,
                searchScore: 0.77,
            });
        });

        it('when sitter has name and stays above 10, Search Score is equal to Rating Score and Rating Score is avg of rates', () => {
            const { ratingScore, searchScore, profileScore } = sitterScorePolicy.calculateScores({ name: 'John', ratings: Array(10).fill(5) });
            expect(searchScore).toEqual(ratingScore);

            expect({ profileScore, ratingScore, searchScore }).toMatchObject({
                profileScore: 0.77,
                ratingScore: 5,
                searchScore: 5,
            });
        });
    });
});
