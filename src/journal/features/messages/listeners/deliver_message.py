from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class DeliverMessage(Listener[Created]):
    """A message the user leaves is typed into the live agent's terminal by number: the engine's own delivery, no state's to change."""

    def __init__(self, agents: Agents, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.agents, self.nudger, self.supervisor = agents, nudger, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.messages.feature import Messages
        message = event.model
        if not isinstance(message, Message) or not message.is_main_unread:
            return
        agent = self.agents.current()
        if agent is None:
            return
        line = self.nudger.deliver(agent, Messages.NEW_MESSAGE.create(n=message.id))
        if line:
            self.supervisor.type(message.environment_id, line)
