# @sin architecture_agents_launcher_reached_outside_the_dispatcher
from core.modules.agents.support.launcher_link import LauncherLink
# @sin architecture_agents_launcher_reached_outside_the_dispatcher
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess


class OpenTerminalText:
    """Says in one line whether an agent's report reaches its parent at once."""

    def __init__(self, link: LauncherLink) -> None:
        self.link = link

    def text(self) -> str:
        return "its report wakes you" if self.link.is_running else "its report arrives at your next hook"

    def launch_record(self, agent_id: int, pid: int) -> RecordAgentProcess:
        return RecordAgentProcess(agent_id, pid)
