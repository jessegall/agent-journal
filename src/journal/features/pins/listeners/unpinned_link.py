from journal.events.agent.turn_written import TurnWritten
from journal.events.agent_listener import AgentListener
from journal.features.pins.support.link_suggestions import LinkSuggestions
from journal.supervisor_link import SupervisorLink


class UnpinnedLink(AgentListener[TurnWritten]):
    """A link the agent gives in the chat that no pin carries is suggested as a pin, so what the user will come back to is not lost as the chat scrolls."""

    def __init__(self, suggestions: LinkSuggestions, supervisor: SupervisorLink) -> None:
        self.suggestions, self.supervisor = suggestions, supervisor

    def handle(self, event: TurnWritten) -> None:
        if not event.final:
            return
        for line in self.suggestions.lines(event.session, event.environment_id, event.text):
            self.supervisor.type(event.environment_id, line)
