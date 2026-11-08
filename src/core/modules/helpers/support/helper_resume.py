from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.cold_sessions import ColdSessions
from core.modules.helpers.support.helper_command import HelperCommand
from core.modules.helpers.support.kept_helpers import KeptHelpers


class HelperResume:
    """Starts an ended helper's session again in its folder, with a job as its brief, or a new session when
    its old one has gone cold."""

    def __init__(self, launcher: AgentLauncher, commands: HelperCommand, environments: EnvironmentRows, kept: KeptHelpers, cold: ColdSessions) -> None:
        self.launcher, self.commands, self.environments = launcher, commands, environments
        self.kept, self.cold = kept, cold

    def resume(self, helper: Agent, job: str) -> None:
        if helper.paused_at is not None or not self.kept.program_state(helper).is_ready:
            return
        current = self.cold.replaced(helper)
        command = self.commands.resumed(helper, job) if current.session == helper.session else self.commands.restarted(current, job)
        self.launcher.hand(current, self.environments.find(helper.environment_id), command)
