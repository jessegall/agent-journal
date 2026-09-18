import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
messages = CONTROLLERS["message"](record, actor=USER)
todos = CONTROLLERS["todo"](record, actor=AGENT)

# NOTHING IN HAND: a row filed with no message read is linked to nothing
m = messages.create("please park the widget work and pin the port")
loose = todos.create("a row with no message behind it")
check("a message the agent has not read is not in its hands", messages.load(m.n).refs, [])

# THE MESSAGE READ AND NOT CLOSED IS IN HAND: what the agent files meanwhile is linked to it
CONTROLLERS["message"](record, actor=AGENT).read(m.n)
todo = todos.create("the widget work")
pin = CONTROLLERS["pin"](record, actor=AGENT).create("the port is 8422")
check("a to-do and a pin filed while the message is in hand are linked to it, by the feature", messages.load(m.n).refs, [todo.ref, pin.ref])
check("the loose row from before stays unlinked", loose.n in [int(r.split(":")[1]) for r in messages.load(m.n).refs if r.startswith("todo:")], False)

# THE USER'S OWN ROWS AND THE AGENT'S REPLIES ARE NOT WHAT THE MESSAGE BECAME
CONTROLLERS["todo"](record, actor=USER).create("the user's own row")
CONTROLLERS["message"](record, actor=AGENT).reply(m.n, "on it")
check("a row the user files, and the agent's reply, are not linked as what it became", len(messages.load(m.n).refs), 2)

# CLOSED, IT LEAVES THE HANDS: the next row goes to the next message read, or nowhere
CONTROLLERS["message"](record, actor=AGENT).complete(m.n, "filed")
later = todos.create("after the message was closed")
check("a closed message takes nothing more", later.ref in messages.load(m.n).refs, False)

done()
