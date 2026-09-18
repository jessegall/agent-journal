import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[4]))
from v2 import features  # noqa: E402
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.providers import PROVIDERS  # noqa: E402
from v2.resources.base import AGENT, SYSTEM  # noqa: E402
from v2.tests.features.kit import nudges as all_nudges, report  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()
nudges = lambda r: [n for n in all_nudges(r) if n.startswith("context")]

record = fresh()
provider = PROVIDERS["claude"]()
gate = lambda: provider.gate(record.root, record.env, "claude-1")
CONTROLLERS["work"](record, actor=AGENT).create("something open")
report(record, "working", "PostToolUse", context=30)
check("under the first mark: no hold, nothing said", (gate(), nudges(record)), ("", []))
report(record, "working", "PostToolUse", context=52)
check("50 crossed: a hold on writes and a nudge to decide", (gate(), nudges(record)), ('context 52% full — decide before any other write — journal pin, journal rule, or journal nothing "<why>"', ["context 52% full, decide"]))
report(record, "working", "PostToolUse", context=60)
check("between marks: the hold stands, nothing new said", (bool(gate()), len(nudges(record))), (True, 1))
CONTROLLERS["pin"](record, actor=AGENT).create("what a later reader needs")
check("a pin decides it: released", gate(), "")
report(record, "working", "PostToolUse", context=71)
check("70 crossed: asked again", len(nudges(record)), 2)
CONTROLLERS["rule"](record, actor=AGENT).create("what binds everywhere")
check("a rule decides it", gate(), "")
report(record, "working", "PostToolUse", context=91)
check("90 crossed", bool(gate()), True)
agents = CONTROLLERS["agent"](record, actor=SYSTEM)
row = agents.by_session("claude-1")
agents.update(row.n, **{**row.data, "decided": "nothing here worth pinning"})
check("journal nothing decides it too", gate(), "")
record.set_setting("triggers", {"context": {"at": [96], "unit": "percent"}})
report(record, "working", "PostToolUse", context=95)
check("the marks are a setting", bool(gate()), False)

done()
