import re

from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision

TRUNCATED = re.compile(r"(?:^|[;&|(]\s*)\S*journal\s+(?:message\s+(?:read|unread|recent)|question\s+(?:show|list))\b[^|;&\"']*\|")
"""A read of the user's words, a message or a question, as a command and not as words quoted inside another, piped into anything: head, tail, grep, cut. The whole of it is the point."""


class RefuseTruncatedRead(AgentListener[ToolStarting]):
    """The user's words are read whole: a journal message read piped into a filter is refused, so no message is half seen."""

    blocking = True

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.messages.feature import Messages
        command = event.input.get("command", "") if event.tool == "Bash" else ""
        return Decision.refuse(Messages.WHOLE.about().rendered()) if TRUNCATED.search(command) else None
