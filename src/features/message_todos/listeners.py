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
    """A to-do filed while a message of the user's is waiting is almost certainly from it, so the journal asks at once rather than waiting for a reply that may never be written."""

    def listen(self, event: TodoCreated, todos: ReadRows[Todo], messages: ReadRows[Message], agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.actor != AGENT or agents.primary_to_read() is None:
            return []
        todo = todos.peek(event.n)
        if messages.is_linked(todo.ref):
            return []
        waiting = next((m for m in reversed(messages.waiting()) if m.created <= todo.created), None)
        return [] if waiting is None else [unlinked(todo, waiting)]


class SpotTodosInReply(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, comments: ReadRows[Comment], todos: ReadRows[Todo], messages: ReadRows[Message],
               agents: ReadRows[AgentRow], settings: Settings, clock: Clock) -> list[Fact]:
        if event.type != "comment" or event.actor != AGENT or agents.primary_to_read() is None:
            return []
        reply = comments.peek(event.n)
        answered = [int(n) for kind, _, n in (ref.partition(":") for ref in reply.refs) if kind == "message" and n.isdigit()]
        since = clock.now() - 60 * float(settings.minutes)
        if not answered or not (recent := [todo for todo in todos.rows.standing() if todo.created >= since]):
            return []
        message = messages.peek(answered[0])
        named_here = todos_named(reply.brief)
        facts = []
        for todo in (todo for todo in recent if not messages.is_linked(todo.ref)):
            if todo.n in named_here:
                facts.append(TodoNamedInReply(message=message.n, todo=todo.n))
            elif todo.created >= message.created:
                facts.append(unlinked(todo, message))
        return facts
