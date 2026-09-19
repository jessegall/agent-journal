import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Comments, Questions, Todos  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh, refused  # noqa: E402

record = fresh()
todo = Todos(record, actor=USER).create("a row")
asked = Questions(record, actor=AGENT)
answered = Questions(record, actor=USER)

# ASKING: options with a pick, a description, about something — all through the one controller
q = asked.create("which colour", abstract="the header is grey today", about=todo.ref,
                 options=[{"title": "blue", "description": "matches the sidebar"}, {"title": "green"}], pick=1)
check("the question links what it is about", q.refs, [todo.ref])
check("its words: ask, answer; its labels: Context and Answer", (asked.named("create"), asked.named("complete"), q.labels), ("ask", "answer", {"outcome": "Answer", "abstract": "Context"}))
check("the user has not seen it; the agent has", (answered.unread() and [x.n for x in answered.unread()], q.seen), ([1], [AGENT]))

legacy = asked.create("which mode", options=[{"label": "fast", "value": "quick", "description": "short path"}])
check("question options normalize label and value to the viewer shape", legacy.data["options"], [{"description": "short path", "title": "fast", "code": "quick"}])
check("an option without a title or label is refused", refused(lambda: asked.create("which mode", options=[{"description": "missing label"}])), "options.title is required")

# ANSWERING is the user's complete; the answer lives on the question and in the event
answered.complete(q.n, "green")
got = asked.load(q.n)
check("answered: complete, with the answer on it", (bool(got.completed), got.outcome), (True, "green"))
check("the answer is an event by the user the agent will be told of", [(e.action, e.actor, e.data.get("how")) for e in record.events() if e.type == "question"][-1], ("completed", USER, "green"))
answered.update(q.n, outcome="blue after all")
check("a new answer replaces the old with set", asked.load(q.n).outcome, "blue after all")

# COMMENTS: done is the comment's complete, with what was done
c = Todos(record, actor=USER).comment(todo.n, "make it two rows")
comments = Comments(record, actor=AGENT)
check("a comment is about the row", c.refs, [todo.ref])
comments.method("done")(c.n, "split into 2 and 3")
check("done keeps what was done", comments.load(c.n).outcome, "split into 2 and 3")

done()
