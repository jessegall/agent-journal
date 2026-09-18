import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from engine.queries import carry, start_block, status  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
f = record.root / "runtime" / f"start-{record.env}.md"
CONTROLLERS["rule"](record, actor=USER).create("name the model on every dispatch")
CONTROLLERS["pin"](record, actor=AGENT).create("v2 imports nothing old")
CONTROLLERS["work"](record, actor=AGENT).create("the header")
CONTROLLERS["doc"](record, actor=AGENT).create("The engine", abstract="the loop from A to Z")
CONTROLLERS["todo"](record, actor=USER).create("later")
block = f.read_text()
check("every write rewrites the start block", block, start_block(record))
check("it says the environment, the rules, the pins, the open work, the docs and the count of to-dos",
      [line for line in block.splitlines() if line and not line.startswith("  ")],
      ["THE JOURNAL IS IN FORCE HERE — this session is bound to environment `t`.", "STILL OPEN, from this or an earlier session (1):", "RULES, in force on every environment (1):", "PINS on this environment (1):",
       "DOCS catalogued — read one before you re-investigate what it settles (1):", "1 TO-DOS waiting — delayed work, not an instruction to start any of it."])
check("a doc line carries its abstract", "    1  The engine  (the loop from A to Z)" in block, True)

# THE HOOK HANDS IT OVER at SessionStart, computing nothing
provider = PROVIDERS["claude"]()
out = provider.handle(record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1"})
check("SessionStart returns the file as context", out["hookSpecificOutput"]["additionalContext"] == f.read_text() and out["hookSpecificOutput"]["hookEventName"], "SessionStart")
check("other events hand nothing over", provider.handle(record.root, record.env, {"hook_event_name": "Stop", "session_id": "s-1"}), {})

# STATUS AND CARRY are reads
check("status counts what stands, by type", status(record).splitlines()[0], "JOURNAL  environment t")
check("carry is the block and every standing thing in full", carry(record).startswith(start_block(record)) and "RULE 1  name the model" in carry(record), True)

done()
