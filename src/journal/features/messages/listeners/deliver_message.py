from journal.engine.nudger import Nudger
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.model_event import ModelEvent
from journal.events.models.synced_creation import SyncedCreation
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink

DELIVERED = (Created, SyncedCreation)


class DeliverMessage(Listener[ModelEvent]):
    """A message the user leaves is typed into the live agent's terminal by number: the engine's own delivery, no state's to change. A message pulled from the team, as a teammate's in the Team chat, is typed into this machine's agent there just the same."""

    def __init__(self, agents: Agents, nudger: Nudger, supervisor: SupervisorLink, scope: Scope) -> None:
        self.agents, self.nudger, self.supervisor, self.scope = agents, nudger, supervisor, scope

    def handle(self, event: ModelEvent) -> None:
        from journal.features.messages.feature import Messages
        message = event.model
        if not isinstance(event, DELIVERED) or not isinstance(message, Message) or not message.is_main_unread:
            return
        with self.scope.environment(message.environment_id):
            agent = self.agents.current()
        if agent is None:
            return
        line = self.nudger.deliver(agent, Messages.NEW_MESSAGE.create(n=message.id))
        if line:
            self.supervisor.type(message.environment_id, line)
