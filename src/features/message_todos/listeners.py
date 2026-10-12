from dataclasses import dataclass

from events import Fact
from events.message_todos import TodoLeftUnlinked, TodoNamedInReply
from events.resources import ResourceCreated
from events.todos import TodoCreated
from features.message_todos.details import UNLINKED
from features.row_links.formatters import Mention, named
from receiving import Listener
from resources.base import AGENT
from resources.types import AgentRow, Comment, Message, Todo
from serving import Clock, ReadRows, Settings


def todos_named(text: str) -> set[int]:
    names, found = named()
    mentions = (Mention.of(m, names) for m in found.finditer(text))
    return {int(n) for mention in mentions if mention.name == "todo" and mention.env is None for n in mention.numbers}


def unlinked(todo: Todo, message: Message) -> Fact:
    return TodoLeftUnlinked(message=message.n, todo=todo.n).once(f"{UNLINKED}|{todo.ref}")


class SpotTodoForWaitingMessage(Listener[TodoCreated]):
    """A to-do filed while a message of the user's waits is asked about at once, not when a reply is written."""

    def listen(self, event: TodoCreated, todos: ReadRows[Todo], messages: ReadRows[Message], agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.actor != AGENT or not agents.has_primary():
            return []
        todo = todos.peek(event.n)
        if messages.is_linked(todo.ref):
            return []
        waiting = next((m for m in reversed(messages.waiting()) if m.created <= todo.created), None)
        return [] if waiting is None else [unlinked(todo, waiting)]


@dataclass(frozen=True)
class Reply:
    """The message an agent's reply answers, the to-dos filed lately that nothing links to it, and the ones the reply names."""

    message: Message
    todos: list[Todo]
    named: set[int]

    @classmethod
    def to(cls, event: ResourceCreated, comments: ReadRows[Comment], todos: ReadRows[Todo], messages: ReadRows[Message], since: float) -> "Reply | None":
        if event.type != "comment" or event.actor != AGENT:
            return None
        reply = comments.peek(event.n)
        answered = [int(n) for kind, _, n in (ref.partition(":") for ref in reply.refs) if kind == "message" and n.isdigit()]
        fresh = [todo for todo in todos.rows.standing() if todo.created >= since and not messages.is_linked(todo.ref)]
        return cls(messages.peek(answered[0]), fresh, todos_named(reply.brief)) if answered and fresh else None


class SpotTodosNamedInReply(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, comments: ReadRows[Comment], todos: ReadRows[Todo], messages: ReadRows[Message], settings: Settings, clock: Clock) -> list[Fact]:
        reply = Reply.to(event, comments, todos, messages, clock.now() - 60 * float(settings.minutes))
        return [] if reply is None else [TodoNamedInReply(message=reply.message.n, todo=todo.n) for todo in reply.todos if todo.n in reply.named]


class SpotTodosLeftOutOfReply(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, comments: ReadRows[Comment], todos: ReadRows[Todo], messages: ReadRows[Message], agents: ReadRows[AgentRow],
               settings: Settings, clock: Clock) -> list[Fact]:
        reply = Reply.to(event, comments, todos, messages, clock.now() - 60 * float(settings.minutes))
        if reply is None or not agents.has_primary():
            return []
        return [unlinked(todo, reply.message) for todo in reply.todos if todo.n not in reply.named and todo.created >= reply.message.created]
