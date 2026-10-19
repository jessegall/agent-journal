from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_starting import ToolStarting
from journal.features.shell.chain import Chain
from journal.support.skill_files import SkillFiles
from journal.support.decision import Decision
from journal.providers.providers import Providers


class Floor:
    """The floor under every workflow's hold: a journal command and the read of a skill's file are how a debt is paid, so no workflow refuses them; the hold's words still reach the agent. The engine's own guards on the shell and on reads stand above it."""

    def __init__(self, providers: Providers, files: SkillFiles) -> None:
        self.providers, self.files = providers, files

    def under(self, event: AgentEvent, decision: Decision) -> Decision:
        if decision.allowed or not isinstance(event, ToolStarting):
            return decision
        provider = self.providers.named(event.provider or "claude")
        pays = self.journal_command(event, provider) or any(self.files.skill_read(path) for path in provider.read_paths(event.tool, event.input))
        return Decision.tell("\n".join(line for line in (decision.context, decision.reason) if line)) if pays else decision

    @staticmethod
    def journal_command(event: ToolStarting, provider) -> bool:
        if event.tool != provider.shell_tool:
            return False
        return Chain.is_journal_line(event.input.get("command", ""))
