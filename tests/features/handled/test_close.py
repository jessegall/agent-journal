import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Messages  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
left = Messages(record, actor=USER)
agent = Messages(record, actor=AGENT)

# ONE PART PROCESSED of two: the message stays open
m = left.create("two asks", brief="fix the header\n\nlater add a csv export")
agent.read(m.n)
agent.process(m.n, "fix the header", "todo 1")
check("a part left: the message stays open", agent.load(m.n).completed, 0.0)

# EVERY PART PROCESSED: the message closes itself, as SYSTEM, naming what each became
agent.process(m.n, "csv export", "todo 2")
closed = agent.load(m.n)
check("every paragraph covered: closed", bool(closed.completed), True)
check("the outcome names what each part became", closed.outcome, "every part became a record: todo 1, todo 2")
check("closed by the feature", [e.actor for e in record.events() if e.type == "message" and e.action == "completed"], [SYSTEM])

# READING IS NOT HANDLING
m2 = left.create("just read me")
agent.read(m2.n)
check("a read message stays open", agent.load(m2.n).completed, 0.0)

# A QUOTED LINE is the reply's context, not a part to process
m3 = left.create("with a quote", brief="> what the agent said\n\nyes, do that")
agent.process(m3.n, "yes, do that", "work")
check("a quote needs no part of its own", bool(agent.load(m3.n).completed), True)

# CLOSED BY HAND FIRST: nothing more happens
m4 = left.create("done by hand", brief="one thing")
agent.method("processed")(m4.n, "handled")
check("an already closed message is left as it is", agent.load(m4.n).outcome, "handled")

# SWITCHED OFF per environment
record = fresh()
record.set_setting("features", {"handled": False})
m = Messages(record, actor=USER).create("one ask")
Messages(record, actor=AGENT).process(m.n, "one ask", "todo 1")
check("switched off: the message stays open", Messages(record).load(m.n).completed, 0.0)

done()
