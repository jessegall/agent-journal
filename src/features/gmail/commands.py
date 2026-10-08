from features.gmail.sync import SOURCE
from features.integrations.commands import proposed
from features.parts import Command, Context
from resources.base import Refused


class ProposeReply(Command):
    name = "gmail_reply"

    def run(self, context: Context, tickets, n: int, text: str) -> str:
        ticket = tickets.load(n)
        if ticket.source != SOURCE or not ticket.data.get("gmail_from"):
            raise Refused(f"{ticket.ref} did not come from Gmail")
        return proposed(context, ticket, f"answer to {ticket.data['gmail_from']}", text)
