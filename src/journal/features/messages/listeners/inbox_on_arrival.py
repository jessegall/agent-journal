from journal.engine.nudger import Nudger
from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink


class InboxOnArrival(Listener[Created]):
    """A message the user leaves while the agent sits at its prompt is typed to it through the supervisor, so it is read at once and not at the next hook."""

    def __init__(self, nudger: Nudger, agents: Agents, supervisor: SupervisorLink) -> None:
        self.nudger, self.agents, self.supervisor = nudger, agents, supervisor

    def handle(self, event: Created) -> None:
        from journal.features.messages.feature import Messages as MessagesFeature
        message = event.model
        if not isinstance(message, Message) or message.author != Author.USER:
            return
        agent = self.agents.live(message.environment_id)
        if agent is None:
            return
        line = self.nudger.say(agent, MessagesFeature.ARRIVED.about(n=message.id, text=message.text))
        if line:
            self.supervisor.type(line)
