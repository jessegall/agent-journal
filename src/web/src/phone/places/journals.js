import {counted} from "../../format/number.js";
import {kindCard, kindWord} from "../kinds.js";

const waitingOf = (detail) => Object.entries(detail?.waiting || {}).filter(([, count]) => count > 0);

export const waitsOf = (detail) =>
    waitingOf(detail)
        .map(([kind, count]) => counted(count, kindWord(kind), kindCard(kind).toLowerCase()))
        .join(", ");

export const waitingCount = (detail) => waitingOf(detail).reduce((sum, [, count]) => sum + count, 0);

export const needsOf = (place) => Object.values(place.details || {}).reduce((sum, detail) => sum + waitingCount(detail), 0);
