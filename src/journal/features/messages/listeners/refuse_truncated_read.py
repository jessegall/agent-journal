import re

from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision

TRUNCATED = re.compile(r"(?:^|[;&|(]\s*)\S*journal\s+message\s+(?:read|unread|recent)\b[^|;&\"']*\|")
"""A read of the user's words, as a command and not as words quoted inside another, piped into anything: head, tail, grep, cut. The whole message is the point."""


class RefuseTruncatedRead(AgentListener[ToolStarting]):
    """The user's words are read whole: a journal message read piped into a filter is refused, so no message is half seen."""

    blocking = True

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.messages.feature import Messages
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        return Decision.refuse(Messages.WHOLE.about().rendered()) if TRUNCATED.search(command) else None
