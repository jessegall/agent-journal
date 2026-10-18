from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class DeliverMessage(Listener[Created]):
    """A message the user leaves is typed into the live agent's terminal by number: the engine's own delivery, not a workflow."""

    def __init__(self, agents: Agents, machine: Machine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.agents, self.machine, self.nudger, self.supervisor = agents, machine, nudger, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.messages.feature import Messages
        message = event.model
        if not isinstance(message, Message) or message.author != Author.USER:
            return
        agent = self.agents.live()
        if agent is None:
            return
        line = self.nudger.say(agent, Messages.NEW.about(n=message.id))
        if line:
            self.supervisor.type(message.environment_id, line)
