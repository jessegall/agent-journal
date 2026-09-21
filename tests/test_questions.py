from controllers.types import Comments, Questions, Todos
from resources.base import AGENT, USER
from tests.conftest import fresh, refused


def test_a_question_is_asked_answered_and_a_comment_can_be_marked_done():
    record = fresh()
    todo = Todos(record, actor=USER).create("a row")
    asked = Questions(record, actor=AGENT)
    answered = Questions(record, actor=USER)

    q = asked.create("which colour", abstract="the header is grey today", about=todo.ref,
                     options=[{"title": "blue", "description": "matches the sidebar"}, {"title": "green"}], pick=1)
    assert q.refs == [todo.ref], "the question links what it is about"
    assert (asked.named("create"), asked.named("complete"), q.labels) == ("ask", "answer", {"outcome": "Answer", "abstract": "Context"}), \
        "its words: ask, answer; its labels: Context and Answer"
    assert (answered.unread() and [x.n for x in answered.unread()], q.seen) == ([1], [AGENT]), "the user has not seen it; the agent has"

    legacy = asked.create("which mode", options=[{"label": "fast", "value": "quick", "description": "short path"}])
    assert legacy.data["options"] == [{"description": "short path", "title": "fast", "code": "quick"}], \
        "question options normalize label and value to the viewer shape"
    assert refused(lambda: asked.create("which mode", options=[{"description": "missing label"}])) == "options.title is required", \
        "an option without a title or label is refused"

    answered.complete(q.n, "green")
    got = asked.load(q.n)
    assert (bool(got.completed), got.outcome) == (True, "green"), "answered: complete, with the answer on it"
    assert [(e.action, e.actor, e.data.get("how")) for e in record.events() if e.type == "question"][-1] == ("completed", USER, "green"), \
        "the answer is an event by the user the agent will be told of"
    answered.update(q.n, outcome="blue after all")
    assert asked.load(q.n).outcome == "blue after all", "a new answer replaces the old with set"

    c = Todos(record, actor=USER).comment(todo.n, "make it two rows")
    comments = Comments(record, actor=AGENT)
    assert c.refs == [todo.ref], "a comment is about the row"
    comments.method("done")(c.n, "split into 2 and 3")
    assert comments.load(c.n).outcome == "split into 2 and 3", "done keeps what was done"
