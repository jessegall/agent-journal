from dataclasses import dataclass

from core.base.actor import Actor
from core.base.driver.command_category import CommandCategory
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle


@dataclass(frozen=True, kw_only=True)
class Process(Model):
    """One shell line an agent ran through the runner: its line, folder and shell, the hook call that started
    it, its foreground limit, and how it ended; its id is the output number the agent reads."""

    model_name = "process"
    cli_name = "process"
    lifecycle = ProcessLifecycle

    environment_id: int
    agent_id: int
    hook_call_id: int | None = None
    creator_id: int
    line: str
    folder: str
    shell: str
    category: CommandCategory
    limit_seconds: int
    state: ProcessState = ProcessState.RUNNING
    exit_code: int | None = None
    pid: int | None = None
    progress: int = 0
    moved_at: Timestamp | None = None
    ended_at: Timestamp | None = None

    def background(self, timestamp: Timestamp, actor: Actor) -> "Process":
        return self.moved(ProcessLifecycle.background, moved_at=timestamp)

    def finish(self, timestamp: Timestamp, actor: Actor, exit_code: int) -> "Process":
        return self.moved(ProcessLifecycle.finish, exit_code=exit_code, ended_at=timestamp)

    def fail(self, timestamp: Timestamp, actor: Actor, exit_code: int) -> "Process":
        return self.moved(ProcessLifecycle.fail, exit_code=exit_code, ended_at=timestamp)

    def stop(self, timestamp: Timestamp, actor: Actor) -> "Process":
        return self.moved(ProcessLifecycle.stop, ended_at=timestamp)

    def orphan(self, timestamp: Timestamp, actor: Actor) -> "Process":
        return self.moved(ProcessLifecycle.orphan, ended_at=timestamp)
