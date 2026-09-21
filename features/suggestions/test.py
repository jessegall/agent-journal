
from controllers.types import Suggestions, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_the_agent_proposes_and_the_user_decides_accept_adjust_or_decline():
    record = fresh()
    mine = Suggestions(record, actor=AGENT)
    theirs = Suggestions(record, actor=USER)
    todos = Todos(record, actor=USER)

    s = mine.create("split the module", brief="it is 900 lines and two ideas")
    assert [o["title"] for o in s.data["options"]] == ["Accept", "Adjust", "Decline"], \
        "a suggestion opens with the three decisions as its options"

    theirs.complete(s.n, "Accept")
    made = [t for t in todos.all() if s.ref in t.refs]
    assert (len(made), made[0].title, made[0].brief, mine.load(s.n).data["decision"]) == \
        (1, "split the module", "it is 900 lines and two ideas", "accept"), \
        "accepting files a to-do with the suggestion's words, citing it"

    s2 = mine.create("rename the helper", brief="its name lies")
    theirs.complete(s2.n, "rename it, but keep the old name as an alias for a release")
    made = [t for t in todos.all() if s2.ref in t.refs]
    assert (made[0].title, "Proposed as: rename the helper" in made[0].brief, mine.load(s2.n).data["decision"]) == \
        ("rename it, but keep the old name as an alias for a release", True, "adjust"), \
        "adjusting files a to-do from the user's words, citing the proposal"

    s3 = mine.create("drop the tests", brief="they are slow")
    theirs.complete(s3.n, "Decline: the tests stay")
    assert [t for t in todos.all() if s3.ref in t.refs] == [], "declining files nothing"
    assert refused(lambda: mine.create("drop the tests")).startswith("suggestion 3 was declined") is True, \
        "a declined suggestion is not proposed again in the same words"
    again = mine.create("drop the tests", brief="the slow ones only", despite=True, because="only the slow ones now")
    assert again.n == 4, "unless the agent says what changed"

    mine.delete(again.n, "fixed another way")
    assert mine.load(again.n).deleted > 0, "the agent withdraws with a reason"

    for i in range(5):
        mine.create(f"proposal {i}")
    assert refused(lambda: mine.create("one more")).startswith("5 suggestions already wait on the user") is True, \
        "a sixth open suggestion is refused, naming the five"
