import csv from 'csv-parser';
import { createReadStream, writeFileSync } from 'fs';

const INPUT_CSV = 'src/reviews.csv';
const CONSTANT_PROFILE_SCORE = 5;
const ALPHABET_LETTERS = 26;
const LIMIT_OF_STAYS_FOR_WEIGHT_AVG = 10;

const profileScoreFormula = (distincLetters) => +(CONSTANT_PROFILE_SCORE * 1 / ALPHABET_LETTERS * distincLetters).toFixed(2);
const avgRatingFormula = (ratings) => {

    const nRatings = ratings.length;
    if (!nRatings) {
        return 0;
    }
    const sumOfRatings = ratings.reduce((acc, rating) => acc + rating, 0);
    const avg = Number((sumOfRatings / nRatings).toFixed(2));
    return avg;
};

const searchScoreFormula = (profileScore, ratingScore, ratings) => {
    const stays = ratings.length;
    if (!stays) {
        /// When a sitter has no stays, their Search Score is equal to the Profile Score.
        return profileScore;
    }

    if (stays >= LIMIT_OF_STAYS_FOR_WEIGHT_AVG) {
        /// When a sitter has 10 or more stays, their Search Score is equal to the Ratings Score.
        return ratingScore;
    }
    const ratio = stays / LIMIT_OF_STAYS_FOR_WEIGHT_AVG;

    const ratingWeight = ratio;
    const profileWeight = 1 - ratio;

    /// weight score
    const searchScore = profileScore * profileWeight + ratingScore * ratingWeight;

    return Number(searchScore.toFixed(2));

};
// rating: ~> 0
// sitter_image:
// end_date:
// text:
// owner_image:
// dogs:
// sitter: ~> 6
// owner:
// start_date:
// sitter_phone_number:
// sitter_email: ~> 10
// owner_phone_number:
// owner_email:
// response_time_minutes:

const writeSittersCSV = (sitters) => {
    const headers = [
        'email',
        'name',
        'profile_score',
        'ratings_score',
        'search_score',
    ];

    const rows = sitters.map(sitter => [
        sitter.email,
        sitter.name,
        sitter.profileScore,
        sitter.ratingScore,
        sitter.searchScore,
    ]);

    const csvHeaders = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');

    writeFileSync('sitters.csv', csvHeaders);
};

const sittersObj = {};
const readCSVFile = () => {
    createReadStream(INPUT_CSV)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {

            const { rating, sitter_email, sitter } = row;

            if (!sittersObj[sitter_email]) {
                sittersObj[sitter_email] = {
                    name: sitter,
                    email: sitter_email,
                    ratings: [],
                    profileScore: calculateProfileScore(sitter),
                };
            }
            sittersObj[sitter_email].ratings.push(Number(rating));
        })
        .on('end', () => {
            // calculate profile score
            // console.log('sittersObjEmail', sittersObj)
            const sitters = Object.values(sittersObj).map(e => {
                e.ratingScore = avgRatingFormula(e.ratings);
                e.searchScore = searchScoreFormula(e.profileScore, e.ratingScore, e.ratings);
                return e;
            }).sort((a, b) => {

                // Search Score descending
                if (b.searchScore !== a.searchScore) {

                    return b.searchScore - a.searchScore;

                }

                // Tie-breaker: name alphabetically
                return a.name.localeCompare(b.name);
            });

            writeSittersCSV(sitters);
            // calculate rating score
            // calculate oversall score
        });

};

const calculateProfileScore = (sitterName) => {
    const uniqLetters = new Set(String(sitterName).toLowerCase().replace(/[^a-z]/g, ''));
    const profileScore = profileScoreFormula(uniqLetters.size);

    return profileScore;
};

readCSVFile();

