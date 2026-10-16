from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.features.triggers.firing import Firing
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.repositories.triggers import Triggers
from journal.supervisor_link import SupervisorLink


class WatchMessage(Listener[Created]):
    """The user's words in a message meet the triggers too: what they set off is typed to the live agent, a sequence started at its first step."""

    def __init__(self, triggers: Triggers, firing: Firing, agents: Agents, supervisor: SupervisorLink) -> None:
        self.triggers, self.firing, self.agents, self.supervisor = triggers, firing, agents, supervisor

    def handle(self, event: Created) -> None:
        message = event.model
        if not isinstance(message, Message) or message.author != Author.USER:
            return
        met = self.triggers.met_by(message.text)
        agent = self.agents.live() if met else None
        if agent is None:
            return
        for line in self.firing.lines(met, agent.session, message.environment_id):
            self.supervisor.type(message.environment_id, line)
