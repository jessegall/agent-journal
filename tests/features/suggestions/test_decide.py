import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Suggestions, Todos  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

features.unload()
features.load()

record = fresh()
mine = Suggestions(record, actor=AGENT)
theirs = Suggestions(record, actor=USER)
todos = Todos(record, actor=USER)

# THE AGENT PROPOSES, THE USER DECIDES
s = mine.create("split the module", brief="it is 900 lines and two ideas")
check("a suggestion opens with the three decisions as its options", [o["title"] for o in s.data["options"]], ["Accept", "Adjust", "Decline"])

# ACCEPTED: a to-do from its title and brief, linked both ways
theirs.complete(s.n, "Accept")
made = [t for t in todos.all() if s.ref in t.refs]
check("accepting files a to-do with the suggestion's words, citing it", (len(made), made[0].title, made[0].brief, mine.load(s.n).data["decision"]), (1, "split the module", "it is 900 lines and two ideas", "accept"))

# ADJUSTED: the user's own words become the to-do
s2 = mine.create("rename the helper", brief="its name lies")
theirs.complete(s2.n, "rename it, but keep the old name as an alias for a release")
made = [t for t in todos.all() if s2.ref in t.refs]
check("adjusting files a to-do from the user's words, citing the proposal", (made[0].title, "Proposed as: rename the helper" in made[0].brief, mine.load(s2.n).data["decision"]), ("rename it, but keep the old name as an alias for a release", True, "adjust"))

# DECLINED: nothing filed, and the same proposal is refused after
s3 = mine.create("drop the tests", brief="they are slow")
theirs.complete(s3.n, "Decline: the tests stay")
check("declining files nothing", [t for t in todos.all() if s3.ref in t.refs], [])
check("a declined suggestion is not proposed again in the same words", refused(lambda: mine.create("drop the tests")).startswith("suggestion 3 was declined"), True)
again = mine.create("drop the tests", brief="the slow ones only", despite=True, because="only the slow ones now")
check("unless the agent says what changed", again.n, 4)

# WITHDRAWN by the agent, with a reason
mine.delete(again.n, "fixed another way")
check("the agent withdraws with a reason", mine.load(again.n).deleted > 0, True)

# AT MOST FIVE WAIT
for i in range(5):
    mine.create(f"proposal {i}")
check("a sixth open suggestion is refused, naming the five", refused(lambda: mine.create("one more")).startswith("5 suggestions already wait on the user"), True)

done()
