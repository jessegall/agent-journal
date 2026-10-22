from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.tool_starting import ToolStarting
from journal.features.skills.support.skill_files import SkillFiles
from journal.support.decision import Decision


class PluginRefusalExemption:
    """What no plugin may refuse: a journal command and the read of a skill's file are how a debt is paid, so they go through with the plugin's words still reaching the agent. The engine's own guards on the shell and on reads are not exempt."""

    def __init__(self, files: SkillFiles) -> None:
        self.files = files

    def applied(self, event: AgentEvent, decision: Decision) -> Decision:
        if decision.allowed or not isinstance(event, ToolStarting):
            return decision
        exempt = event.call.is_journal or any(self.files.skill_read(path) for path in event.call.read_paths)
        return Decision.allowed_with("\n".join(line for line in (decision.context, decision.reason) if line)) if exempt else decision

