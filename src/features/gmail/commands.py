from controllers.types import Questions
from features.gmail.details import KEEP, SEND
from features.gmail.sync import SOURCE
from features.parts import Command, Context
from resources.base import AGENT, Refused, titled


class ProposeReply(Command):
    name = "gmail_reply"

    def run(self, context: Context, tickets, n: int, text: str) -> str:
        ticket = tickets.load(n)
        if ticket.source != SOURCE or not ticket.data.get("gmail_from"):
            raise Refused(f"{ticket.ref} did not come from Gmail")
        Questions(context.record, actor=AGENT).create(titled(f"Send this answer to {ticket.data['gmail_from']} for {ticket.ref.replace(':', ' ')}"), brief=text.strip(),
                                                      options=[{"title": SEND}, {"title": KEEP}], pick=2, about=ticket.ref, gmail_reply=True)
        return f"asked you whether to send it; nothing is sent until you press {SEND}"


class SyncGmail(Command):
    name = "sync_gmail"
    network = True

    def run(self, context: Context, features) -> str:
        state = context.feature.check(context.record)
        return state.last_error or "checked Gmail"
