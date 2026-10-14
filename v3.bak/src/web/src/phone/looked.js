const key = (place) => `phone-looked:${place}`;

export function lastLooked(place) {
    try {
        const kept = localStorage.getItem(key(place));
        return kept === null ? null : Number(kept);
    } catch (error) {
        return null;
    }
}

export function looked(place, created) {
    try {
        if (created > (lastLooked(place) || 0)) localStorage.setItem(key(place), String(created));
    } catch (error) {
        return;
    }
}
