import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
from tests.kit import check, done  # noqa: E402

root = Path(__file__).resolve().parents[3]
script = '''
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
got = json.loads(subprocess.run(["node", "--input-type=module", "-e", script], cwd=root, text=True, capture_output=True, check=True, timeout=60).stdout)

# NOTHING IS SHOWN THAT HAS NOT BEEN SENT
check("an empty queue shows nothing", got["nothing"], {"at": 0, "since": 0, "key": None})
check("a client opening mid-flight joins at the newest message", got["joins"], {"at": 200, "since": 500, "key": "m200"})
check("a running message with nothing after it stays", got["staysWhileRunning"], {"at": 200, "since": 400, "key": "m200"})
check("a running last message never ages out", got["aRunningLastOneNeverGoes"], "m200")

# HOW LONG EACH MESSAGE STAYS
check("a message that holds keeps the bar for its hold, then gives way", got["holdsBeforeTheNext"], ["m100", "m200"])
check("a message with no hold gives way at once", got["noHoldMovesAtOnce"], "m200")
check("a finished last message lingers, then the bar empties", got["lingersThenGoes"], ["m100", None])
check("a message that arrives after the bar went quiet is picked up", got["picksUpAfterItWentQuiet"], "m300")

# WHAT EACH PART SHOWS
check("a part with several values walks them once and stops on the last", got["rolls"], ["a", "a", "b", "c", "c"])
check("a part with one value never rolls", got["stillPartsDoNotRoll"],
      {"values": ["editing"], "at": 0, "value": "editing", "color": "muted", "prefix": "", "increments": False})
check("a count keeps its sign and says it increments", got["counts"],
      {"values": [13], "at": 0, "value": 13, "color": "green", "prefix": "+", "increments": True})
check("the clock says nothing until the journal asks for it", got["clocks"], ["", "", "30s", "1m 35s"])
check("a line is its key, its parts, its words and whether it is finished",
      (got["reads"]["key"], got["reads"]["text"], got["reads"]["done"]), ("m100", "editing b.py", False))

done()
