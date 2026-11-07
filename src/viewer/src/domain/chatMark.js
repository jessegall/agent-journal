// A chat mark as the figure reads it: what the server guessed it is about when it wrote it, from its title, never matched again here
export class ChatMark {
    constructor(card) {
        this.card = card;
    }

    isTest() {
        return Boolean(this.card.guesses?.test);
    }

    isBuild() {
        return Boolean(this.card.guesses?.build);
    }

    isUpload() {
        return Boolean(this.card.guesses?.upload);
    }
}
