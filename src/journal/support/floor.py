from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_starting import ToolStarting
from journal.support.skill_files import SkillFiles
from journal.support.decision import Decision


class Floor:
    """The floor under every workflow's hold: a journal command and the read of a skill's file are how a debt is paid, so no workflow refuses them; the hold's words still reach the agent. The engine's own guards on the shell and on reads stand above it."""

    def __init__(self, files: SkillFiles) -> None:
        self.files = files

    def under(self, event: AgentEvent, decision: Decision) -> Decision:
        if decision.allowed or not isinstance(event, ToolStarting):
            return decision
        exempt = event.call.is_journal or any(self.files.skill_read(path) for path in event.call.read_paths)
        return Decision.allowed_with("\n".join(line for line in (decision.context, decision.reason) if line)) if exempt else decision

