import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Messages, Nudges, Works  # noqa: E402
from engine.hooks import gate_file, handle  # noqa: E402
from features.base import held  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
def gate():
    f = gate_file(record.root, record.env, "claude-1")
    return json.loads(f.read_text()).get("messages.unread", "") if f.is_file() else ""
Works(record, actor=AGENT).create("something open")
inbox = lambda: [n for n in nudges(record) if "inbox" in n]


def use(n):
    report(record, "working", "PreToolUse", uses=n)


use(1)
check("nothing unread: nothing said", inbox(), [])
Messages(record, actor=USER).create("look at the header")
use(2)
check("the first tool use after a message arrives: told at once, without numbers", inbox(), ["there are new messages in your inbox"])
use(3)
use(4)
check("then every third use", len(inbox()), 1)
use(5)
check("the third: told again", len(inbox()), 2)
for n in range(6, 15):
    use(n)
check("fifteen uses in: five nudges, still no hold", (len(inbox()), gate()), (5, ""))
use(15)
use(16)
use(17)
check("the sixth nudge: the gate holds until the inbox is read", gate(), "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write")
Messages(record, actor=AGENT).read(1)
use(18)
check("read: released, and nothing more is said", (gate(), len(inbox())), ("", 6))
Messages(record, actor=USER).create("another")
use(19)
check("a new message: told at once again, the count starting over", (len(inbox()), gate()), (7, ""))
patient = fresh()
patient.set_setting("messages", {"unread.patience": 0})
Works(patient, actor=AGENT).create("open")
Messages(patient, actor=USER).create("hi")
report(patient, "working", "PreToolUse", uses=3)
report(patient, "working", "PreToolUse", uses=6)
check("patience is a setting", held(patient, "claude-1") != "", True)

# PRIVATE: the nudge is never typed into the terminal; the next hook hands it to the agent as context
check("the inbox nudge is private", all(n.data.get("private") for n in Nudges(record).all() if "inbox" in n.title), True)
provider = PROVIDERS["claude"]()
whisper = handle(provider, record.root, record.env, {"hook_event_name": "PostToolUse", "session_id": "claude-1", "tool_name": "Read"})
check("PostToolUse carries the unread private nudges as context and marks them read", ("there are new messages in your inbox" in whisper["hookSpecificOutput"]["additionalContext"], whisper["hookSpecificOutput"]["hookEventName"]), (True, "PostToolUse"))
check("handed once", handle(provider, record.root, record.env, {"hook_event_name": "PostToolUse", "session_id": "claude-1", "tool_name": "Read"}), {})

done()
