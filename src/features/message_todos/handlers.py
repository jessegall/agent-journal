import time

from controllers.types import Comments, Messages, Todos

from events.resources import ResourceCreated
from features.message_todos.details import UNLINKED
from features.parts import Context, Handler
from features.row_links.formatters import Mention, named
from resources.base import AGENT
from events.todos import TodoCreated


def todos_named(text: str) -> set[int]:
    names, found = named()
    mentions = (Mention.of(m, names) for m in found.finditer(text))
    return {int(n) for mention in mentions if mention.name == "todo" and mention.env is None for n in mention.numbers}


class AskWhetherATodoCameFromAMessage(Handler):
    """A to-do filed while a message of the user's is waiting is almost certainly from it, so the journal asks at once rather than waiting for a reply that may never be written."""

    def handle(self, context: Context, event: TodoCreated) -> None:
        if event.actor != AGENT:
            return
        todo = context.journal.get(Todos).load(event.n)
        messages = context.journal.get(Messages)
        if messages.is_linked(todo.ref):
            return
        open_message = next((m for m in reversed(messages.waiting()) if m.created <= todo.created), None)
        speaking = context.to_primary()
        if open_message is not None and speaking and speaking.once(UNLINKED, todo.ref):
            speaking.agent.say(UNLINKED, todo=todo.n, message=open_message.n)


class LinkTodosToTheirMessage(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "comment" or event.actor != AGENT:
            return
        reply = context.journal.get(Comments).load(event.n)
        answered = [int(n) for kind, _, n in (ref.partition(":") for ref in reply.refs) if kind == "message" and n.isdigit()]
        if not answered:
            return
        since = time.time() - 60 * float(context.settings.minutes)
        recent = [todo for todo in context.journal.get(Todos).rows.standing() if todo.created >= since]
        if not recent:
            return
        messages = context.journal.get(Messages)
        message = messages.load(answered[0])
        fresh = [todo for todo in recent if not messages.is_linked(todo.ref)]
        named_here = todos_named(reply.brief)
        speaking = context.to_primary()
        for todo in fresh:
            if todo.n in named_here:
                messages.link(message.n, todo.ref)
                continue
            if todo.created >= message.created and speaking and speaking.once(UNLINKED, todo.ref):
                speaking.agent.say(UNLINKED, todo=todo.n, message=message.n)
