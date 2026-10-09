import time

from controllers.types import Comments, Messages, Todos
from engine.events.resources import ResourceCreated
from features.message_todos.details import UNLINKED
from features.parts import Context, Handler
from features.row_links.formatters import Mention, named
from resources.base import AGENT


def todos_named(text: str) -> set[int]:
    names, found = named()
    mentions = (Mention.of(m, names) for m in found.finditer(text))
    return {int(n) for said in mentions if said.name == "todo" and said.env is None for n in said.numbers}


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
        linked = {ref for row in messages.rows.summaries() for ref in row["refs"]}
        fresh = [todo for todo in recent if todo.ref not in linked]
        named_here = todos_named(reply.brief)
        speaking = context.to_primary()
        for todo in fresh:
            if todo.n in named_here:
                messages.link(message.n, todo.ref)
                continue
            if todo.created >= message.created and speaking and speaking.once(UNLINKED, todo.ref):
                speaking.agent.say(UNLINKED, todo=todo.n, message=message.n)
