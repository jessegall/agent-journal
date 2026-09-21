import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCRIPT = '''
import {clock, frames, line, shown} from "./web/src/layout/bar.js";

const message = (at, more = {}) => ({key: `m${at}`, at, parts: [{value: "editing", color: "gray"}], done: false, for: 0,
                                     clock: false, hold: 0, lingers: 10, ...more});
const play = (queue, state, now) => {
    const got = shown(queue, state, now);
    return {at: got.at, since: got.since, key: got.message ? got.message.key : null};
};
const empty = {at: 0, since: 0};
const one = message(100, {done: true, hold: 1});
const two = message(200);

console.log(JSON.stringify({
    nothing: play([], empty, 500),
    joins: play([message(100), message(200)], empty, 500),
    staysWhileRunning: play([two], {at: 200, since: 400}, 500),
    holdsBeforeTheNext: [play([one, two], {at: 100, since: 500}, 500.5).key, play([one, two], {at: 100, since: 500}, 501).key],
    noHoldMovesAtOnce: play([message(100, {done: true}), two], {at: 100, since: 500}, 500).key,
    lingersThenGoes: [play([one], {at: 100, since: 500}, 509).key, play([one], {at: 100, since: 500}, 510).key],
    aRunningLastOneNeverGoes: play([two], {at: 200, since: 400}, 9999).key,
    picksUpAfterItWentQuiet: play([one, message(300)], {at: 100, since: 100}, 900).key,
    rolls: [0, 0.9, 1, 2, 99].map((s) => frames({parts: [{value: ["a", "b", "c"], duration: 1}]}, s)[0].value),
    stillPartsDoNotRoll: frames({parts: [{value: "editing"}]}, 9)[0],
    counts: frames({parts: [{value: 13, prefix: "+", increments: true, color: "green"}]}, 0)[0],
    clocks: [clock(null), clock({clock: false, for: 30}), clock({clock: true, for: 30}), clock({clock: true, for: 95})],
    reads: line(message(100, {parts: [{value: "editing", color: "gray"}, {value: ["a.vue", "b.py"], duration: 1}]}), 1),
}));
'''


def test_the_bar_module_shows_the_oldest_unshown_message_and_holds_it_correctly():
    got = json.loads(subprocess.run(["node", "--input-type=module", "-e", SCRIPT], cwd=ROOT, text=True, capture_output=True, check=True, timeout=60).stdout)

    assert got["nothing"] == {"at": 0, "since": 0, "key": None}, "an empty queue shows nothing"
    assert got["joins"] == {"at": 100, "since": 500, "key": "m100"}, "a client that has shown nothing starts at the oldest message it was sent"
    assert got["staysWhileRunning"] == {"at": 200, "since": 400, "key": "m200"}, "a running message with nothing after it stays"
    assert got["aRunningLastOneNeverGoes"] == "m200", "a running last message never ages out"

    assert got["holdsBeforeTheNext"] == ["m100", "m200"], "a message that holds keeps the bar for its hold, then gives way"
    assert got["noHoldMovesAtOnce"] == "m200", "a message with no hold gives way at once"
    assert got["lingersThenGoes"] == ["m100", None], "a finished last message lingers, then the bar empties"
    assert got["picksUpAfterItWentQuiet"] == "m300", "a message that arrives after the bar went quiet is picked up"

    assert got["rolls"] == ["a", "a", "b", "c", "c"], "a part with several values walks them once and stops on the last"
    assert got["stillPartsDoNotRoll"] == \
        {"values": ["editing"], "at": 0, "value": "editing", "color": "muted", "prefix": "", "increments": False}, \
        "a part with one value never rolls"
    assert got["counts"] == {"values": [13], "at": 0, "value": 13, "color": "green", "prefix": "+", "increments": True}, \
        "a count keeps its sign and says it increments"
    assert got["clocks"] == ["", "", "30s", "1m 35s"], "the clock says nothing until the journal asks for it"
    assert (got["reads"]["key"], got["reads"]["text"], got["reads"]["done"]) == ("m100", "editing b.py", False), \
        "a line is its key, its parts, its words and whether it is finished"
