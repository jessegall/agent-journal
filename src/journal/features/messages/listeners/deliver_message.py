from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class DeliverMessage(Listener[Created]):
    """A message the user leaves is typed into the live agent's terminal by number: the engine's own delivery, not a workflow."""

    def __init__(self, agents: Agents, machine: StateMachine, nudger: Nudger, supervisor: SupervisorLink) -> None:
        self.agents, self.machine, self.nudger, self.supervisor = agents, machine, nudger, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.messages.feature import Messages
        message = event.model
        if not isinstance(message, Message) or message.author != Author.USER or message.read_at:
            return
        agent = self.agents.live()
        if agent is None:
            return
        line = self.nudger.say(agent, Messages.NEW_MESSAGE_TO_ANSWER.create(n=message.id))
        if line:
            self.supervisor.type(message.environment_id, line)
