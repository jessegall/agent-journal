from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.features.triggers.support.firing import Firing
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.agents import Agents
from journal.repositories.triggers import Triggers


class WatchMessage(Listener[Created]):
    """The user's words in a message meet the triggers too: each met is recorded as a card and a sequence one names is started; what is said of them is the triggers conduct's, on the message's arrival."""

    def __init__(self, triggers: Triggers, firing: Firing, agents: Agents) -> None:
        self.triggers, self.firing, self.agents = triggers, firing, agents

    def handle(self, event: Created) -> None:
        message = event.model
        if not isinstance(message, Message) or message.author != Author.USER or message.is_typed_in_terminal:
            return
        agent = self.agents.live()
        if agent is None:
            return
        self.firing.fired(self.triggers.met_by(message.text), agent.session, message.environment_id, True)
