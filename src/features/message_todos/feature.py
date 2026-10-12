from framework.base import Feature
from framework.journal import Journal
from features.message_todos.details import UNLINKED, MessageTodosDetails
from features.message_todos.handlers import AskWhetherATodoCameFromAMessage, LinkTodoToItsMessage
from features.message_todos.listeners import SpotTodoForWaitingMessage, SpotTodosLeftOutOfReply, SpotTodosNamedInReply
from events.message_todos import TodoLeftUnlinked, TodoNamedInReply
from events.resources import ResourceCreated
from expects import Dispatches, Given, Nudged, Updated, WHEN, nothing
from events.todos import TodoCreated
from resources.base import AGENT, USER
from resources.types import AgentRow, Comment, Message, Todo

REPLY = Comment(n=1, title="Filed it", brief="Filed as to-do 7.", refs=["message:12"])
REPLY_NOT_NAMING = Comment(n=1, title="Filed it", brief="Filed it.", refs=["message:12"])
FRESH = Todo(n=7, title="The thing to do", created=WHEN - 60)
STALE = Todo(n=7, title="Filed hours before the reply", created=WHEN - 60 * 60 * 5)
ASKED = Message(n=12, title="can you look at this", created=WHEN - 600)
LINKED = Message(n=12, title="can you look at this", created=WHEN - 600, refs=["todo:7"])

AGENT_ROW = AgentRow(n=1, title="claude-1")
FILED = Todo(n=7, title="The thing to do", created=WHEN - 60)
MINUTES = {"message_todos.minutes": 30}


def filed(actor: str) -> TodoCreated:
    return TodoCreated(n=7, type="todo", action="created", actor=actor)


def replied(actor: str = AGENT, kind: str = "comment") -> ResourceCreated:
    return ResourceCreated(type=kind, n=1, actor=actor)


def unlinked_fact() -> TodoLeftUnlinked:
    return TodoLeftUnlinked(message=12, todo=7).once(f"{UNLINKED}|todo:7")


class MessageTodos(Feature):
    details = MessageTodosDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ResourceCreated, SpotTodosNamedInReply(), expects=[
            Given(replied(), rows=[REPLY, FRESH, ASKED], settings=MINUTES) >> Dispatches(TodoNamedInReply(message=12, todo=7)),
            Given(replied(), rows=[REPLY_NOT_NAMING, FRESH, ASKED], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(), rows=[REPLY, STALE, ASKED], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(), rows=[REPLY, FRESH, LINKED], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(kind="todo"), rows=[REPLY, FRESH, ASKED], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(actor=USER), rows=[REPLY, FRESH, ASKED], settings=MINUTES) >> Dispatches(nothing),
        ])
        journal.events.listen(ResourceCreated, SpotTodosLeftOutOfReply(), expects=[
            Given(replied(), rows=[REPLY_NOT_NAMING, FRESH, ASKED, AGENT_ROW], settings=MINUTES) >> Dispatches(unlinked_fact()),
            Given(replied(), rows=[REPLY, FRESH, ASKED, AGENT_ROW], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(), rows=[REPLY_NOT_NAMING, STALE, ASKED, AGENT_ROW], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(), rows=[REPLY_NOT_NAMING, FRESH, ASKED], settings=MINUTES) >> Dispatches(nothing),
            Given(replied(actor=USER), rows=[REPLY_NOT_NAMING, FRESH, ASKED, AGENT_ROW], settings=MINUTES) >> Dispatches(nothing),
        ])
        journal.events.listen(TodoCreated, SpotTodoForWaitingMessage(), expects=[
            Given(filed(AGENT), rows=[ASKED, FILED, AGENT_ROW]) >> Dispatches(unlinked_fact()),
            Given(filed(AGENT), rows=[FILED, AGENT_ROW]) >> Dispatches(nothing),
            Given(filed(USER), rows=[ASKED, FILED, AGENT_ROW]) >> Dispatches(nothing),
            Given(filed(AGENT), rows=[LINKED, FILED, AGENT_ROW]) >> Dispatches(nothing),
            Given(filed(AGENT), rows=[Message(n=12, title="written after the to-do", created=WHEN + 600), FILED, AGENT_ROW]) >> Dispatches(nothing),
            Given(filed(AGENT), rows=[Message(n=12, title="written by the agent", created=WHEN - 600, seen=[AGENT]), FILED, AGENT_ROW]) >> Dispatches(nothing),
            Given(filed(AGENT), rows=[ASKED, FILED]) >> Dispatches(nothing),
        ])
        journal.events.handle(TodoNamedInReply, LinkTodoToItsMessage(), expects=[
            Given(TodoNamedInReply(message=12, todo=7), rows=[ASKED, FRESH]) >> Updated(Message(n=12), refs=["todo:7"]),
        ])
        journal.events.handle(TodoLeftUnlinked, AskWhetherATodoCameFromAMessage(), expects=[
            Given(TodoLeftUnlinked(message=12, todo=7), rows=[ASKED, FRESH, AGENT_ROW]) >> Nudged(UNLINKED, todo=7, message=12),
        ])
