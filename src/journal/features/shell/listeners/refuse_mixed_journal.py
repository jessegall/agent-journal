from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.chain import Chain
from journal.support.decision import Decision


class RefuseMixedJournal(AgentListener[ToolStarting]):
    """A journal command runs on its own, or chained only with other journal commands: chained with anything else it would move to the background with it, and its answer lost."""

    blocking = True

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.shell.feature import Shell
        if event.tool != "Bash":
            return None
        journal, parts = Chain.journal_parts(event.input.get("command", ""))
        return Decision.refuse(Shell.ALONE.create().rendered()) if 0 < journal < parts else None
