import { ALPHABET_LETTERS, CONSTANT_PROFILE_SCORE, LIMIT_OF_STAYS_FOR_WEIGHT_AVG } from '#domain/constants/index.js';
import { round } from '#utils/number.util.js';

export class SitterScorePolicy {

    /**
     *
     * @param {*} value
     * @param {*} total
     * @returns weight calculation based on ratio
     */
    #weightCalculation(value, total) {
        const ratio = value / total;

        const weight1 = ratio;
        const weight2 = 1 - ratio;
        return { weight1, weight2 };
    }

    /**
     *
     * @param {*} distinctLetters
     * @returns profile score base on distinct letters
     */
    #profileScoreFormula(distinctLetters) {
        return round(CONSTANT_PROFILE_SCORE * 1 / ALPHABET_LETTERS * distinctLetters);
    }

    /**
     * Calculates distinct letters from a text
     *
     * e.g:
     * - 'AAAaaa' -> a
     *
     * @param {*} text
     * @returns distinct letters found at project
     */
    #getDistinctLetters(text) {
        return new Set(String(text).toLowerCase().replace(/[^a-z]/g, ''));
    }

    /**
     * Calculates the Profile Score based on the number
     * of distinct letters in the sitter's name.
     *
     * Formula:
     * - 5 * 1/#ALPHABET_LETTERS * (#SITTERS_NAME_DISTINCT_LETTERS)
     *
     * @param {*} sitterName
     * @returns Profile Score based on Distinct Letters of Sitter's name
     */
    calculateProfileScore(sitterName) {
        const uniqLetters = this.#getDistinctLetters(sitterName);
        const profileScore = this.#profileScoreFormula(uniqLetters.size);
        return profileScore;
    }

    /**
     * Calculates the avg of the ratings
     *
     * @param {*} ratings
     * @returns avg of ratings (Rating Score)
     */
    calculateRatingScore(ratings) {

        const nRatings = ratings.length;
        if (!nRatings) {
            return 0;
        }
        const sumOfRatings = ratings.reduce((acc, rating) => acc + rating, 0);
        const avg = round((sumOfRatings / nRatings));
        return avg;
    }

    /**
     *
     * Rules:
     * - When a sitter has no stays, their Search Score is equal to the Profile Score.
     *
     * - When a sitter has 10 or more stays, their Search Score is equal to the Ratings Score.
     *
     * - If has less than 10 stays uses a weight calculation between rating and profile scores
     *
     * @param {{profileScore,ratingScore, stays}} param0
     * @returns Search Score
     */
    calculateSearchScore({ profileScore, ratingScore, stays }) {
        if (!stays) {
            return profileScore;
        }

        if (stays >= LIMIT_OF_STAYS_FOR_WEIGHT_AVG) {
            return ratingScore;
        }

        const { weight1: ratingWeight, weight2: profileWeight } = this.#weightCalculation(stays, LIMIT_OF_STAYS_FOR_WEIGHT_AVG);

        const searchScore = profileScore * profileWeight + ratingScore * ratingWeight;

        return round(searchScore);
    }

    /**
     * Calculates Sitter's Score based on his ratings
     *
     * @param {{name,ratings}} param0
     * @returns {{profileScore, ratingScore,searchScore}}
     */
    calculateScores({ name, ratings }) {
        const profileScore = this.calculateProfileScore(name);
        const ratingScore = this.calculateRatingScore(ratings);
        const searchScore = this.calculateSearchScore({
            profileScore,
            ratingScore,
            stays: ratings?.length,
        });

        return { profileScore, ratingScore, searchScore };
    }
}
