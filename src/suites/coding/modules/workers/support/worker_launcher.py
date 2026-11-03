from core.base.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.environments.models.environment import Environment

FAILED_ANSWER = b"failed\n"
RUNNING_ANSWER = b"running\n"
ANSWER_BYTES = 16


class WorkerLauncher:
    """Hands the running launcher a worker's program, folder and agent row to start, and says whether it
    started; a worker whose program still runs is not started again, and its line waits for its next hook. A
    launcher older than this journal answers nothing, which counts as started."""

    def __init__(self, link: LauncherLink) -> None:
        self.link = link

    def hand(self, worker: Agent, environment: Environment, command: LaunchCommand) -> bool:
        return self.link.sent({"agent_id": worker.id, "session": worker.session, "environment": environment.name, "folder": str(command.folder),
                               "command": list(command.arguments), "variables": dict(command.variables)}, ANSWER_BYTES) not in (None, FAILED_ANSWER, RUNNING_ANSWER)
