import { SitterScore } from '#domain/entities/sitterScore.entity.js';

export class CalculateSitterRankingUseCase {

    constructor(sitterRepository, sitterScorePolicy) {
        this.sitterRepository = sitterRepository;
        this.sitterScorePolicy = sitterScorePolicy;
    }

    /**
     * Calculates Scores based on Sitter data obtained by a CSV input
     *
     * Rules:
     * - The csv should be sorted by Search Score (descending)
     * - Sorting alphabetically on the sitter name as a tie-breaker.
     * @returns Sitter's Scores generated in a CSV File
     */
    async execute() {
        const sitters = await this.sitterRepository.findAll();
        const scoreSitters = sitters.map(sitter => {
            const { ratings, name, email } = sitter;

            const { profileScore, ratingScore, searchScore } =
                this.sitterScorePolicy.calculateScores({ name, ratings });

            return new SitterScore(name, email, profileScore, ratingScore, searchScore);
        });

        scoreSitters.sort((a, b) => {
            if (a.searchScore === b.searchScore) {
                return a.name.localeCompare(b.name);
            }
            return b.searchScore - a.searchScore;
        });

        await this.sitterRepository.printAll(scoreSitters);
        return scoreSitters;
    }
}
