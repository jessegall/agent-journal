import {placeUnder} from "../../kit/vContext.js";
import {menuEntries} from "../../src/composables/contextMenu.js";
import {settle} from "./windowContext.js";

// what a right click on a card offers, and choosing one of the items as a person would (asking again for a danger item)
export const itemsOf = (card) => menuEntries(placeUnder(card).items).filter((entry) => !entry.separator);
export const labelsOf = (card) => itemsOf(card).map((entry) => entry.label);
export async function choose(card, label, spoken = []) {
    await itemsOf(card).find((entry) => entry.label === label).run({say: (text) => spoken.push(text)});
    await settle();
}
