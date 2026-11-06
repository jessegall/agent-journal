from core.base.leftover_process import LeftoverProcess
from core.base.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink


class AgentProgram:
    """Stops an agent's program: under the pid its row keeps, only while that pid still runs that program, or else
    through the launcher that runs it. Says whether anything could be asked to stop it."""

    def __init__(self, providers: Providers, launcher: LauncherLink) -> None:
        self.providers, self.launcher = providers, launcher

    def stop(self, agent: Agent) -> bool:
        if agent.pid is None:
            return self.launcher.stop(agent.terminal_id)
        LeftoverProcess.stop(agent.pid, self.providers.provider(agent.program).executable)
        return True
