import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Messages  # noqa: E402
from engine.hooks import gate_file  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
Agents(record, actor=AGENT).by_session("claude-1")
m = Messages(record, actor=USER).create("how is it going?")
Messages(record, actor=AGENT).read(m.n)


def holds():
    f = gate_file(record.root, record.env, "claude-1")
    return json.loads(f.read_text()) if f.is_file() else {}


def said():
    return [n for n in nudges(record) if "before you write" in n]


check("before the next tool use nothing is said", said(), [])
report(record, "working", "PreToolUse")
check("the first tool use after reading names the message and says to answer it", said(), ["answer message 1 before you write anything"])
check("nothing is refused over it: it tells, it does not hold", holds().get("status", ""), "")
for i in range(5):
    report(record, "working", "PreToolUse")
check("said three times in all and then it lets the agent be", len(said()), 3)
Messages(record, actor=AGENT).reply(m.n, "halfway: the build is green, wiring the last route")
report(record, "working", "PreToolUse")
check("a reply settles it and lifts the hold", holds().get("status", ""), "")

fresh_record = fresh()
Agents(fresh_record, actor=AGENT).by_session("claude-1")
m2 = Messages(fresh_record, actor=USER).create("noted?")
Messages(fresh_record, actor=AGENT).read(m2.n)
Messages(fresh_record, actor=AGENT).react(m2.n, "👍")
for i in range(3):
    report(fresh_record, "working", "PreToolUse")
check("a reaction counts as an answer", [n for n in nudges(fresh_record) if "before you write" in n], [])

done()
