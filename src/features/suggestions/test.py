from controllers.types import Agents, Todos
from features.suggestions.controller import CHANGE, NO, YES, Suggestions
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused


def test_the_agent_proposes_and_the_user_decides_accept_adjust_or_decline():
    record = fresh()
    mine = Suggestions(record, actor=AGENT)
    theirs = Suggestions(record, actor=USER)
    todos = Todos(record, actor=USER)

    s = mine.create("split the module", brief="it is 900 lines and two ideas")
    assert [o["title"] for o in s.data["options"]] == [YES, CHANGE, NO], \
        "a suggestion opens with the three answers as its options"

    theirs.complete(s.n, YES)
    made = [t for t in todos.all() if s.ref in t.refs]
    assert (len(made), made[0].title, made[0].brief, mine.load(s.n).data["decision"]) == \
        (1, "split the module", "it is 900 lines and two ideas", "accept"), \
        "yes files a to-do with the suggestion's words, citing it"

    s2 = mine.create("rename the helper", brief="its name lies")
    theirs.complete(s2.n, "rename it, but keep the old name as an alias for a release")
    made = [t for t in todos.all() if s2.ref in t.refs]
    assert (made[0].title, "Proposed as: rename the helper" in made[0].brief, mine.load(s2.n).data["decision"]) == \
        ("rename it, but keep the old name as an alias for a release", True, "adjust"), \
        "a change files a to-do from the user's words, citing the proposal"

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


def test_the_users_answer_shows_on_their_side_of_the_chat_and_no_can_be_taken_back():
    record = fresh()
    Agents(record, actor=SYSTEM).by_session("claude-1")
    mine = Suggestions(record, actor=AGENT)
    theirs = Suggestions(record, actor=USER)
    marks = lambda: [(c["label"], c["name"], c.get("detail", "")) for c in Agents(record, actor=SYSTEM).primary().data.get("cards", []) if c.get("side") == USER]

    s = mine.create("keep the file list between searches")
    theirs.complete(s.n, YES)
    todo = next(t for t in Todos(record, actor=SYSTEM).all() if s.ref in t.refs)
    assert marks() == [("You said yes to suggestion", str(s.n), f"Added to-do {todo.n}")], "yes leaves a mark naming the to-do it added"
    assert theirs.load(s.n).data["todo"] == todo.n, "and the suggestion keeps the to-do's number for its card"

    s2 = mine.create("drop the tests")
    theirs.complete(s2.n, NO)
    assert marks()[-1] == ("You said no to suggestion", str(s2.n), ""), "no leaves a mark too"
    theirs.reopen(s2.n)
    assert (len(marks()), theirs.load(s2.n).completed, theirs.load(s2.n).decision) == (1, 0.0, ""), \
        "taking the no back removes its mark and reopens the suggestion as unanswered"
    assert mine.create("drop the tests", brief="again").n == s2.n + 1, "and a no taken back is not a ruling"

    s3 = mine.create("the agent closes this one")
    mine.complete(s3.n, "Accept")
    assert len(marks()) == 1, "an answer the agent gives leaves no mark on the user's side"

    assert theirs.note_window(s.n).data["window_seen"] > 0, "the window that opened is kept on the suggestion, once for every device"
    assert "not a plugin" in refused(lambda: theirs.install(s2.n)), "only a plugin suggestion installs"
