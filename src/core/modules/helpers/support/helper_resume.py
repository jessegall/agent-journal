from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.helper_command import HelperCommand
from core.modules.helpers.support.kept_helpers import KeptHelpers


class HelperResume:
    """Starts an ended helper's session again in its folder, with a job as its brief."""

    def __init__(self, launcher: AgentLauncher, commands: HelperCommand, environments: EnvironmentRows, kept: KeptHelpers) -> None:
        self.launcher, self.commands, self.environments = launcher, commands, environments
        self.kept = kept

    def resume(self, helper: Agent, job: str) -> None:
        if helper.paused_at is None and self.kept.program_state(helper).is_ready:
            self.launcher.hand(helper, self.environments.find(helper.environment_id), self.commands.resumed(helper, job))
