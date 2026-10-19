from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.features.pins.support.link_suggestions import LinkSuggestions
from journal.support.decision import Decision


class UnpinnedLinkInOutput(AgentListener[ToolFinished]):
    """A link in what a tool printed, such as the address of a pull request just opened, is suggested as a pin beside the tool's answer."""

    blocking = True

    def __init__(self, suggestions: LinkSuggestions) -> None:
        self.suggestions = suggestions

    def handle(self, event: ToolFinished) -> Decision | None:
        if event.subagent:
            return None
        lines = self.suggestions.lines(event.session, event.environment_id, event.output)
        return Decision.tell("\n".join(lines)) if lines else None
