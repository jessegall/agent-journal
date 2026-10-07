import time

from controllers.types import Messages
from features.parts import Command, Context
from resources.base import AGENT, USER

WRITERS = {USER: "the user", AGENT: "you"}


class Recent(Command):
    name = "recent"

    def run(self, context: Context, messages: Messages) -> str:
        rows = messages.all(completed=True, last=context.settings.count)
        agent = context.to_primary()
        if agent:
            agent.release()
        if not rows:
            return "no messages yet"
        return "\n\n".join(entry(row) for row in rows)


def entry(row) -> str:
    when = time.strftime("%Y-%m-%d %H:%M", time.localtime(row.created))
    return f"message {row.n} · {WRITERS.get(row.author, row.author)} · {when}\n{(row.brief or row.title).strip()}"
