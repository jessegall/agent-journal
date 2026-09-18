import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.features.kit import nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
gate = lambda: PROVIDERS["claude"]().gate(record.root, record.env, "claude-1")
CONTROLLERS["work"](record, actor=AGENT).create("something open")
inbox = lambda: [n for n in nudges(record) if "inbox" in n]


def use(n):
    report(record, "working", "PreToolUse", uses=n)


use(1)
check("nothing unread: nothing said", inbox(), [])
CONTROLLERS["message"](record, actor=USER).create("look at the header")
use(2)
check("a tool use with a message unread: told, without numbers", inbox(), ["there are new messages in your inbox"])
for n in range(3, 7):
    use(n)
check("told after every tool use while it stays unread", len(inbox()), 5)
check("within patience: no hold", gate(), "")
use(7)
check("past patience: the gate holds until the inbox is read", gate(), "your inbox is unread: journal message unread, then journal message read <n> for each, before any other write")
CONTROLLERS["message"](record, actor=AGENT).read(1)
use(8)
check("read: released, and nothing more is said", (gate(), len(inbox())), ("", 6))
CONTROLLERS["message"](record, actor=USER).create("another")
use(9)
check("the count starts over for the next unread message", (len(inbox()), gate()), (7, ""))
patient = fresh()
patient.set_setting("inbox", {"patience": 1})
CONTROLLERS["work"](patient, actor=AGENT).create("open")
CONTROLLERS["message"](patient, actor=USER).create("hi")
report(patient, "working", "PreToolUse", uses=1)
report(patient, "working", "PreToolUse", uses=2)
check("patience is a setting", PROVIDERS["claude"]().gate(patient.root, patient.env, "claude-1") != "", True)

done()
