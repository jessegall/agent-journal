// The figure's head turns by weighted looks blended with its act. Each frame it is handed the things it could look at, each a look
// {key, kind, point} of a kind with its weight in LOOKS; every act declares how strongly it keeps its own head (its clip's `head`, one of
// HEAD). The head turns toward the strongest look, blended with the act's own head pose by the two weights (headBlend), and a new
// strongest look takes over only once it has led for SWITCH_SECONDS (leadingLook), the head easing toward it as it turns
// (reactions.js gazeAfter), so it never swings between targets in a moment; and a look it is on is held through a lapse in what it looks
// at of up to LINGER_SECONDS, so an interest renewed carries the same look on rather than turning away and back.

// The weight of each kind of look: the image attached to a message of the user's that the agent is reading, the strongest of all while it
// lasts (attachmentRead), the user's new message, the pointer tickling it, a finished run's mark or its docked
// bar it waits to light the visor for, the UFO or the crane carrying a box, the bubble it reads or holds its glass to, the agent's new
// message in the chat, the sin's mark it kneels to, the composer while the user types in it, at full weight while the keystrokes are fresh
// and at half of it after a pause in them (composerLook), the box it builds or pushes, a picture it admires, a progress bar it chose to
// watch, and its own idle glances
export const LOOKS = {attachment: 10, said: 9, pointer: 8, run: 7, carrier: 6, confession: 6, reading: 5, message: 4, typing: 3.5, work: 3, typing_pause: 1.75, picture: 2, bar: 2, glance: 1};

// How strongly an act keeps its own head: hardly at all walking or standing, somewhat through a gesture that moves it, almost wholly
// where the act's head is part of what it does, as climbing the ladder, under the parachute, rummaging or thinking, and `alone` wholly,
// following nothing but the act itself, as on the telephone, taking up no look at all until it is over (looksFor)
export const HEAD = {free: 1, gestures: 3, holds: 30, alone: Infinity};

// how long a new strongest look must lead before the head takes it up, in seconds
export const SWITCH_SECONDS = 2;

// how long the head holds a look whose target is no longer among the looks, at where it last was, before the interest counts as over, in
// seconds
export const LINGER_SECONDS = 2;

// how long the image of a message the agent reads is a look after the read began, in seconds
export const ATTACHMENT_SECONDS = 3;

// The message whose attached file the agent read in the last ATTACHMENT_SECONDS before `now`, from the timeline `entries` the viewer holds
// (a ToolStarting whose call read a path under .journal/files/message/<n>/), or 0 when it read none
export function attachmentRead(entries, now) {
    const reads = entries
        .filter((entry) => entry.entry_type === "ToolStarting" && now - Date.parse(entry.created_at) / 1000 <= ATTACHMENT_SECONDS)
        .flatMap((entry) => (entry.data?.call?.read_paths || []).map((path) => ({path, at: Date.parse(entry.created_at)})))
        .map(({path, at}) => ({message: Number(/\/files\/message\/(\d+)\//.exec(path)?.[1] ?? 0), at}))
        .filter(({message}) => message);
    return reads.sort((a, b) => b.at - a.at)[0]?.message ?? 0;
}

// how long a new message is a look after it comes into the chat, in seconds
export const MESSAGE_SECONDS = 4;

// How long the composer is a look after the user's last keystroke, in seconds, and how much of that at full weight: the look is the
// strongest just after the typing and weakens after a pause, then lapses
export const COMPOSER_SECONDS = 6;
export const COMPOSER_FULL_SECONDS = 2;

// The kind of look the composer is at `now` seconds when the user last typed in it at `typedAt` (0 when never): typing while the keystrokes
// are fresh, typing_pause through the pause after them, none once it is over
export function composerLook(typedAt, now) {
    const pause = now - typedAt;
    if (!typedAt || pause > COMPOSER_SECONDS) return null;
    return pause <= COMPOSER_FULL_SECONDS ? "typing" : "typing_pause";
}

// The messages, pictures, composer and run marks belong to the screen behind the figure. Props, the pointer and idle glances stay in
// the room in front of it. Apply the depth here so every look at a screen element uses the same side of the figure.
export const SCREEN_LOOKS = new Set(["attachment", "said", "run", "confession", "reading", "message", "typing", "typing_pause", "picture", "bar"]);

// the looks the figure may take up this frame playing `clip`: none for an act that keeps its head alone; otherwise each screen target
// explicitly behind the figure, keeping its mood and any limit on the body's turn
export const looksFor = (clip, looks) => clip.head === HEAD.alone ? [] : looks.map((look) => SCREEN_LOOKS.has(look.kind) ? {...look, point: {...look.point, behind: true}} : look);

// The eased page look in the figure's picture, whose top left is `at` and whose height is `size`. Keep the target's turn limit and
// other metadata when changing its coordinates, so a limited look stays limited after the figure moves.
export function lookInFigure(gaze, at, size) {
    if (!gaze.amount || !gaze.point) return null;
    return {...gaze.point, ...(Number.isFinite(gaze.point.readingCenter) ? {readingCenter: (gaze.point.readingCenter - at.x) / size} : {}), x: (gaze.point.x - at.x) / size, y: (gaze.point.y - at.y) / size, amount: gaze.amount, behind: Boolean(gaze.point.behind), faces: Boolean(gaze.point.faces), mood: gaze.point.mood ?? ""};
}

// whether `clip` keeps its head as its act poses it, never turned to the viewer for a look
export const holdsHead = (clip) => clip.head >= HEAD.holds;

// how far the head turns from the act's own pose toward `look`, 0 to 1, for the clip `clip`: the look's weight against the act's
export const headBlend = (look, clip) => (look ? LOOKS[look.kind] / (LOOKS[look.kind] + clip.head) : 0);

// The look the head is on at `now` seconds, from what it was on, `leading` ({look, challenger, since, seen} or none, `seen` when its
// target was last among the looks), and `looks`, the looks it could take this frame: the strongest of them; but while the look it is on
// is still among them, or was within LINGER_SECONDS, held where it last was, a new strongest takes over only once it has led for
// SWITCH_SECONDS, the head keeping meanwhile to the look it is on, moved to where that look is now; the user's new message takes over
// at once (haltsWalk)
export function leadingLook(leading, looks, now) {
    const lingers = Boolean(leading?.look) && !looks.some((look) => look.key === leading.look.key) && now - leading.seen < LINGER_SECONDS;
    const kept = lingers ? [...looks, leading.look] : looks;
    if (!kept.length) return {look: null, challenger: "", since: now, seen: now};
    const held = leading?.look && kept.find((look) => look.key === leading.look.key);
    const seen = (look) => (lingers && look === held ? leading.seen : now);
    const top = Math.max(...kept.map((look) => LOOKS[look.kind]));
    const strongest = held && LOOKS[held.kind] === top ? held : kept.find((look) => LOOKS[look.kind] === top);
    if (!held || held === strongest || haltsWalk(strongest)) return {look: strongest, challenger: "", since: now, seen: seen(strongest)};
    const since = leading.challenger === strongest.key ? leading.since : now;
    if (now - since >= SWITCH_SECONDS) return {look: strongest, challenger: "", since: now, seen: now};
    return {look: held, challenger: strongest.key, since, seen: seen(held)};
}

// While the figure walks its body faces the way it walks, and its head only glances: at a look ahead of it or to its side, within a quarter
// turn of the walk (its point on the walk's side of the head, or straight above or below it), for at most `glance` seconds, then at nothing
// for `rest` seconds. The user's new message (LOOKS said) halts the walk instead: the figure stands turned to it, looking, `halt` seconds,
// then goes over to it or on its way, by the message's weight against the walk's `purpose` and a roll.
export const WALKING = {glance: 1.2, rest: 2.5, halt: 1.5, purpose: 6};

// The look the head takes at `now` while the figure walks the way `way` (1 the right) with its head at `head` on the page, `look` the one
// leading (leadingLook), and the glance it is in, `glancing` ({since}, when it began): the look while it lies within a quarter turn of the
// walk and the glance lasts, none in the rest after it, a new glance beginning once that is over
export function walkingGlance(glancing, look, way, head, now) {
    const ahead = Boolean(look) && (look.point.x - head.x) * way >= 0;
    if (glancing && now < glancing.since + WALKING.glance + WALKING.rest) return {look: ahead && now < glancing.since + WALKING.glance ? look : null, glancing};
    return ahead ? {look, glancing: {since: now}} : {look: null, glancing};
}

// whether `look` halts the figure's walk: the user's new message does
export const haltsWalk = (look) => look?.kind === "said";

// whether the figure, its halt over, goes over to the message it halted for rather than on its way, drawn with `random`
export const visitsAfterHalt = (random) => random() < LOOKS.said / (LOOKS.said + WALKING.purpose);

// The figure's own idle glances: every `every` seconds or so, a glance of `lasts` seconds to a point `aside` of its picture to one of
// `sides` of its head (0 straight out of the page, at the viewer) and `up` of it above, as shares of the picture; seated it glances
// less far, a little to one side or at the viewer
export const GLANCE = {every: [6, 14], lasts: 1.6, aside: 0.9, up: 0.12, sides: [-1, 1]};
export const SEATED_GLANCE = {every: [4, 10], lasts: 2.4, aside: 0.2, up: 0.04, sides: [-1, 0, 1]};

// The glance `glance` ({at, side, kind}, `at` the seconds it begins) as it is at `now`: kept until it is over, then the next of `kind`,
// GLANCE or SEATED_GLANCE, drawn with `random`
export function glanceAfter(glance, now, random, kind) {
    if (glance && now < glance.at + glance.kind.lasts) return glance;
    return {at: now + kind.every[0] + random() * (kind.every[1] - kind.every[0]), side: kind.sides[Math.floor(random() * kind.sides.length)], kind};
}

// the point a glance looks at `now` beside a head at `head` on the page, in a picture `size` pixels high, or null outside it
export function glancePoint(glance, now, head, size) {
    if (!glance || now < glance.at || now >= glance.at + glance.kind.lasts) return null;
    return {x: head.x + glance.side * glance.kind.aside * size, y: head.y - glance.kind.up * size};
}
