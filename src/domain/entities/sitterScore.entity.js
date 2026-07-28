export class SitterScore {
    constructor(
        name,
        email,
        profileScore,
        ratingScore,
        searchScore,
    ) {
        this.name = name;
        this.email = email;
        this.profileScore = profileScore;
        this.ratingScore = ratingScore;
        this.searchScore = searchScore;
    }

    toList() {
        return [
            this.email,
            this.name,
            this.profileScore,
            this.ratingScore,
            this.searchScore,
        ];
    }
}
