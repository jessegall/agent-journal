import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Messages  # noqa: E402
from features.buttons.feature import MOST, shaped  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
rows = Messages(record, actor=AGENT)

# A BUTTON NAMES A TYPE AND ONE OF ITS ACTIONS, with the row it acts on
start = {"label": "Okay, start", "type": "plan", "n": 3, "action": "activate"}
check("a button on a row is kept as it was written", shaped(record, [start]), [start])
check("a type-level button needs no row", shaped(record, [{"label": "New to-do", "type": "todo", "action": "add", "body": {"title": "one"}}]),
      [{"label": "New to-do", "type": "todo", "action": "add", "body": {"title": "one"}}])
check("a word the type renames is an action too", shaped(record, [{"label": "Done", "type": "todo", "n": 1, "action": "done"}]),
      [{"label": "Done", "type": "todo", "action": "done", "n": 1}])

# ANYTHING THAT WOULD NOT RUN is dropped rather than failing under the user's finger
check("a type nobody has is dropped", shaped(record, [{"label": "Go", "type": "nonsense", "n": 1, "action": "all"}]), [])
check("an action the type does not have is dropped", shaped(record, [{"label": "Go", "type": "plan", "n": 1, "action": "detonate"}]), [])
check("a button with no label is dropped", shaped(record, [{"label": "  ", "type": "plan", "n": 1, "action": "activate"}]), [])
check("what is not a list of objects is nothing", (shaped(record, "go"), shaped(record, [7])), ([], []))
check("no more than five are kept", len(shaped(record, [start] * (MOST + 3))), MOST)
check("a button may say it can be pressed again", shaped(record, [{**start, "again": True}]), [{**start, "again": True}])

# WRITING THE MESSAGE cleans what the agent put on it
made = rows.create("Ready when you are", buttons=[start, {"label": "Go", "type": "plan", "n": 1, "action": "detonate"}])
check("the message keeps the button that runs and drops the one that does not", rows.load(made.n).data["buttons"], [start])
plain = rows.create("Nothing to press")
check("a message with no buttons is left alone", "buttons" in rows.load(plain.n).data, False)
later = rows.create("buttons put on afterwards")
rows.update(later.n, buttons=[{"label": "Go", "type": "plan", "n": 1, "action": "detonate"}, start])
check("buttons added after the message was written are cleaned the same way", rows.load(later.n).data["buttons"], [start])

done()
