import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Messages, Notifications, Nudges, Pins, Todos  # noqa: E402
from engine.actors import User  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from resources.types import TYPES  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()


def told(record):
    return [(n.title, n.abstract, n.refs[0]) for n in Notifications(record).all()]


# THE AGENT'S ACTS reach the user as notifications, in the type's own words; the user's own acts make none
record = fresh()
Messages(record, actor=USER).create("look at the header")
check("the user's act makes no notification", told(record), [])
Messages(record, actor=AGENT).complete(1, "read")
check("the agent's act does, naming the type, the number, the type's word and the title", told(record), [("Message 1 processed", "look at the header", "message:1")])
Todos(record, actor=AGENT).create("a chore")
check("a to-do added by the agent: the type's word for create", told(record)[-1][0], "To-do 1 add")
Pins(record, actor=SYSTEM).create("bookkeeping")
check("bookkeeping by the system makes none", len(told(record)), 2)
Nudges(record, actor=AGENT).create("a nudge")
Agents(record, actor=AGENT).by_session("s")
check("types that do not notify the user make none", len(told(record)), 2)
check("a notification itself never notifies", USER in TYPES["notification"].notify, False)

# THE USER READS THEM as unseen; seeing one takes it off
unread = User(record).unread()
check("unread notifications are the user's unseen ones", [n.title for n in unread], ["Message 1 processed", "To-do 1 add"])
Notifications(record, actor=USER).read(1)
check("seen: gone from unread", [n.title for n in User(record).unread()], ["To-do 1 add"])

# THE AGENT MAY WRITE ONE ITSELF, to say a long piece of work landed
Notifications(record, actor=AGENT).create("the migration is through", about="todo:1")
check("a direct notification stands beside the feature's", [n.title for n in User(record).unread()], ["To-do 1 add", "the migration is through"])

done()
