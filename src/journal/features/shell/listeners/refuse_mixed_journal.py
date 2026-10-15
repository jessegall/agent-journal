from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.shell.chain import Chain
from journal.hooks.decision import Decision


class RefuseMixedJournal(AgentListener[ToolStarting]):
    """A journal command runs on its own, or chained only with other journal commands: chained with anything else it could be carried off to the background with it, and its answer lost."""

    blocking = True

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.shell.feature import Shell
        if event.tool != "Bash":
            return None
        journal, parts = Chain.journal_parts(event.input.get("command", ""))
        return Decision.refuse(Shell.ALONE.about().rendered()) if 0 < journal < parts else None
