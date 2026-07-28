export class Sitter {
    constructor(name, email) {
        this.name = name.trim();
        this.email = email.trim();
        this.ratings = [];
    }

    addRating(rate) {
        this.ratings.push(+rate);
    }
}
