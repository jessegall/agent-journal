from features.base import Feature
from features.journal import Journal
from features.message_todos.details import MessageTodosDetails
from features.message_todos.handlers import AskWhetherATodoCameFromAMessage, LinkTodosToTheirMessage
from engine.events.resources import ResourceCreated
from expects import Given, Nudged, Unchanged, Updated, WHEN
from features.message_todos.handlers import TodoCreated
from resources.base import AGENT, USER
from resources.types import AgentRow, Comment, Message, Todo

REPLY = Comment(n=1, title="Filed it", brief="Filed as to-do 7.", refs=["message:12"])
FRESH = Todo(n=7, title="The thing to do", created=WHEN - 60)
STALE = Todo(n=7, title="Filed hours before the reply", created=WHEN - 60 * 60 * 5)
ASKED = Message(n=12, title="can you look at this", created=WHEN - 600)
REPLIED = (REPLY, FRESH, ASKED)

AGENT_ROW = AgentRow(n=1, title="claude-1")
FILED = Todo(n=7, title="The thing to do", created=WHEN - 60)


def filed(actor: str) -> TodoCreated:
    return TodoCreated(n=7, type="todo", action="created", actor=actor)


class MessageTodos(Feature):
    details = MessageTodosDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LinkTodosToTheirMessage(), expects=[
            Given(ResourceCreated(type="comment", n=1, actor=AGENT), rows=REPLIED, settings={"message_todos.minutes": 30})
                >> Updated(Message(n=12), refs=["todo:7"]),
            Given(ResourceCreated(type="comment", n=1, actor=AGENT), rows=(REPLY, STALE, ASKED), settings={"message_todos.minutes": 30})
                >> Unchanged(),
            Given(ResourceCreated(type="todo", n=1, actor=AGENT), rows=REPLIED, settings={"message_todos.minutes": 30})
                >> Unchanged(),
        ])
        journal.events.handler(AskWhetherATodoCameFromAMessage(), expects=[
            Given(filed(AGENT), rows=[ASKED, FILED, AGENT_ROW]) >> Nudged("unlinked"),
            Given(filed(USER), rows=[ASKED, FILED, AGENT_ROW]) >> Unchanged(),
            Given(filed(AGENT), rows=[Message(n=12, title="can you look at this", created=WHEN - 600, refs=["todo:7"]), FILED, AGENT_ROW]) >> Unchanged(),
            Given(filed(AGENT), rows=[Message(n=12, title="written after the to-do", created=WHEN + 600), FILED, AGENT_ROW]) >> Unchanged(),
            Given(filed(AGENT), rows=[Message(n=12, title="written by the agent", created=WHEN - 600, seen=[AGENT]), FILED, AGENT_ROW]) >> Unchanged(),
            Given(filed(AGENT), rows=[ASKED, FILED]) >> Unchanged(),
        ])
