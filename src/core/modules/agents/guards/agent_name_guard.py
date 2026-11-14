import re

from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent

PLAIN_NAME = re.compile(r"[^\W\d_]+([ .'-]+[^\W\d_]+)*\.?")


class AgentNameGuard(Guard[Created[Agent]]):
    """An agent's name is a user's name and nothing more, so a list of agents stays short."""

    name = "agents.plain-name"

    def check(self, event: Created[Agent], context: Context) -> None:
        if event.row.given_name and not PLAIN_NAME.fullmatch(event.row.given_name):
            raise Refusal(f"an agent's name is only the name, with no comma or description: {event.row.given_name}")
