import { CalculateSitterRankingUseCase } from '#application/use-cases/calculateSittersRaking.use-case.js';
import { SitterScorePolicy } from '#domain/policies/sitterScore.policy.js';

describe('CalculateSitterRankingUseCase', () => {
    let sitterRepository;
    let sitterScorePolicy;

    beforeAll(() => {
        sitterScorePolicy = new SitterScorePolicy();
    });

    it('when no sitters are found should return empty', async () => {
        sitterRepository = {
            findAll: () => Promise.resolve([]),
            printAll: async () => { },
        };

        const useCase = new CalculateSitterRankingUseCase(
            sitterRepository,
            sitterScorePolicy,
        );
        const result = await useCase.execute();

        expect(result).toEqual([]);
    });

    it('when sitter has no stays should return scores where Profile Score equals to Search Score', async () => {
        const mockSitters = [{ ratings: [], name: 'john', email: 'john@test.com' }];
        const expectedProfileScore = 0.77;
        sitterRepository = {
            findAll: () => Promise.resolve(mockSitters),
            printAll: async () => { },
        };
        const useCase = new CalculateSitterRankingUseCase(
            sitterRepository,
            sitterScorePolicy,
        );

        const [sitterScore] = await useCase.execute();
        const { email: _, name: __, ratings: ___, ...score } = sitterScore;
        const { profileScore, searchScore } = score;

        expect(profileScore).toEqual(searchScore);

        expect(score).toMatchObject({
            profileScore: expectedProfileScore,
            ratingScore: 0,
            searchScore: expectedProfileScore,
        });

    });

    it('result should be sorted by search score, sorting alphabetically on the sitter name as a tie-breaker', async () => {
        const mockSitters = [
            { ratings: [], name: 'john', email: 'john@test.com' },
            { ratings: [], name: 'jane', email: 'jane@test.com' },
            { ratings: [], name: 'any', email: 'any@test.com' },
        ];
        sitterRepository = {
            findAll: () => Promise.resolve(mockSitters),
            printAll: async () => { },
        };
        const useCase = new CalculateSitterRankingUseCase(
            sitterRepository,
            sitterScorePolicy,
        );
        const sittersScores = await useCase.execute();
        const resultScores = sittersScores.map(({ name, searchScore }) => ({ name, searchScore }));

        expect(resultScores).toMatchObject([
            { name: 'jane', searchScore: 0.77 },
            { name: 'john', searchScore: 0.77 },
            { name: 'any', searchScore: 0.58 },
        ]);
        const [jane, john, any] = resultScores;
        expect(jane.searchScore >= john.searchScore).toBe(true);
        expect(any.searchScore < john.searchScore).toBe(true);
        expect(jane.searchScore === john.searchScore).toBe(true);
    });

});
