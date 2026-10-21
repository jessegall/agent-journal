from journal.events.listener import Listener
from journal.events.rows.message_arrived import MessageArrived
from journal.repositories.agents import Agents
from journal.support.actor import Actor


class MarkInboxArrival(Listener[MessageArrived]):
    """A message of the user's arriving marks the live agent's tool-use count on its row, so the inbox reminders count tool uses since that message from the one counter."""

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def handle(self, event: MessageArrived) -> None:
        for agent in self.agents.live_in(event.environment_id):
            self.agents.save(agent.message_arrived(), Actor.system())
