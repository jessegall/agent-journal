import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Messages  # noqa: E402
from providers.base import gate_file  # noqa: E402
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
    return [n for n in nudges(record) if "status update" in n]


for i in range(9):
    report(record, "working", "PreToolUse")
check("nine tool uses after reading: nothing yet", said(), [])
report(record, "working", "PreToolUse")
check("ten: a private nudge to give a status update, naming the message", said(), ["give the user a status update on message 1"])
for i in range(10):
    report(record, "working", "PreToolUse")
check("twenty: said again", len(said()), 2)
check("still no hold after two", holds().get("status", ""), "")
for i in range(10):
    report(record, "working", "PreToolUse")
check("thirty: the third goes unheeded and the writes wait", bool(holds().get("status")), True)
Messages(record, actor=AGENT).reply(m.n, "halfway: the build is green, wiring the last route")
report(record, "working", "PreToolUse")
check("a reply settles it and lifts the hold", holds().get("status", ""), "")

fresh_record = fresh()
Agents(fresh_record, actor=AGENT).by_session("claude-1")
m2 = Messages(fresh_record, actor=USER).create("noted?")
Messages(fresh_record, actor=AGENT).read(m2.n)
Messages(fresh_record, actor=AGENT).react(m2.n, "👍")
for i in range(12):
    report(fresh_record, "working", "PreToolUse")
check("a reaction counts as an answer", [n for n in nudges(fresh_record) if "status update" in n], [])

done()
