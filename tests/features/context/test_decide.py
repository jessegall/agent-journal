import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Pins, Rules, Works  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT, SYSTEM  # noqa: E402
from tests.features.kit import nudges as all_nudges, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()
nudges = lambda r: [n for n in all_nudges(r) if n.startswith("context")]

record = fresh()
provider = PROVIDERS["claude"]()
gate = lambda: provider.gate(record.root, record.env, "claude-1")
Works(record, actor=AGENT).create("something open")
report(record, "working", "PostToolUse", context=30)
check("under the first mark: no hold, nothing said", (gate(), nudges(record)), ("", []))
report(record, "working", "PostToolUse", context=52)
check("50 crossed: a hold on writes and a nudge to decide", (gate(), nudges(record)), ('context 52% full — decide before any other write — journal pin, journal rule, or journal nothing "<why>"', ["context 52% full, decide"]))
report(record, "working", "PostToolUse", context=60)
check("between marks: the hold stands, nothing new said", (bool(gate()), len(nudges(record))), (True, 1))
Pins(record, actor=AGENT).create("what a later reader needs")
check("a pin decides it: released", gate(), "")
report(record, "working", "PostToolUse", context=71)
check("70 crossed: asked again", len(nudges(record)), 2)
Rules(record, actor=AGENT).create("what binds everywhere")
check("a rule decides it", gate(), "")
report(record, "working", "PostToolUse", context=91)
check("90 crossed", bool(gate()), True)
agents = Agents(record, actor=SYSTEM)
row = agents.by_session("claude-1")
agents.update(row.n, **{**row.data, "decided": "nothing here worth pinning"})
check("journal nothing decides it too", gate(), "")
record.set_setting("triggers", {"context": {"at": [96], "unit": "percent"}})
report(record, "working", "PostToolUse", context=95)
check("the marks are a setting", bool(gate()), False)

done()
