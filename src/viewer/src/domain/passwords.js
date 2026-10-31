const LETTERS = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_!";
const LENGTH = 22;

// A password of 22 characters from letters, digits and symbols, which the team server takes as strong at any mix.
export function strongPassword() {
    const values = crypto.getRandomValues(new Uint32Array(LENGTH));
    return Array.from(values, (value) => LETTERS[value % LETTERS.length]).join("");
}
