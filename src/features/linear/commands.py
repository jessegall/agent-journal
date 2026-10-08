from controllers.types import Questions
from features.linear.details import KEEP, SEND
from features.parts import Command, Context
from resources.base import AGENT, Refused, titled


class ProposeComment(Command):
    name = "linear_comment"

    def run(self, context: Context, tickets, n: int, text: str) -> str:
        ticket = tickets.load(n)
        if ticket.source != "linear" or not ticket.source_id:
            raise Refused(f"{ticket.ref} did not come from Linear")
        Questions(context.record, actor=AGENT).create(titled(f"Send this comment to Linear on {ticket.ref.replace(':', ' ')}"), brief=text.strip(),
                                                      options=[{"title": SEND}, {"title": KEEP}], pick=2, about=ticket.ref, linear_comment=True)
        return f"asked you whether to send it; nothing is sent until you press {SEND}"


class SyncLinear(Command):
    name = "sync"
    network = True

    def run(self, context: Context, features, name: str) -> str:
        if name != "linear":
            raise Refused("only linear has something to sync")
        state = context.feature.check(context.record)
        return state.last_error or f"checked Linear, up to {state.cursor or 'the start'}"
