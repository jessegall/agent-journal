from features.integrations.commands import proposed
from features.parts import Command, Context
from resources.base import Refused


class ProposeComment(Command):
    name = "linear_comment"

    def run(self, context: Context, tickets, n: int, text: str) -> str:
        ticket = tickets.load(n)
        if ticket.source != "linear" or not ticket.source_id:
            raise Refused(f"{ticket.ref} did not come from Linear")
        return proposed(context, ticket, "comment to Linear", text)
