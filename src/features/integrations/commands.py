from controllers.types import Questions
from features.integrations.details import KEEP, SEND
from features.parts import Command, Context
from resources.base import AGENT, titled


class SyncIntegration(Command):
    network = True

    def __init__(self, service: str):
        self.name = f"sync_{service}"

    def run(self, context: Context, features) -> str:
        state = context.feature.check(context.record)
        return state.last_error or f"checked {context.feature.details.title}"


def proposed(context: Context, ticket, what: str, text: str) -> str:
    """Asks you whether to send an agent's text to the service a ticket came from; nothing is sent until you press Send."""
    Questions(context.record, actor=AGENT).create(titled(f"Send this {what} for {ticket.ref.replace(':', ' ')}"), brief=text.strip(),
                                                  options=[{"title": SEND}, {"title": KEEP}], pick=2, about=ticket.ref, proposal=context.feature.name)
    return f"asked you whether to send it; nothing is sent until you press {SEND}"
