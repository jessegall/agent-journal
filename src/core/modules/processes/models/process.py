from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.enums.sandbox_level import SandboxLevel
from engine.enums.command_category import CommandCategory
from engine.model.environment_scoped import EnvironmentScoped
from engine.enums.process_kind import ProcessKind
from engine.model.model import Model
from engine.time.timestamp import MINUTE_SECONDS, Timestamp
from engine.time.duration import Duration
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.enums.queue_priority import QueuePriority
from core.modules.processes.models.lifecycles.process_lifecycle import OPEN, ProcessLifecycle

FINISHED_PROGRESS = 100
ENDING_PHRASES = {ProcessState.RUNNING: "is running", ProcessState.BACKGROUND: "is running", ProcessState.STOPPED: "was stopped", ProcessState.ORPHANED: "was lost"}


@dataclass(frozen=True, kw_only=True)
class Process(EnvironmentScoped, Model):
    """One shell line an agent ran through the runner: its line, folder and shell, the hook call that started
    it, its foreground limit, and how it ended; its id is the output number the agent reads."""

    model_name = "process"
    shared_rows = True
    cli_name = "process"
    search_fields = ["line"]
    search_rank = -1
    search_ignored_start = "journal search "
    lifecycle = ProcessLifecycle

    environment_id: int = 0
    session_agent_id: int
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
    is_full_test_run: bool = False
    queued_at: Timestamp | None = None
    is_queue_run: bool = False
    started_at: Timestamp | None = None
    slot_assigned: bool = False
    owner_agent_id: int | None = None
    task_id: int | None = None
    plugin: str = ""
    kind: str = ""
    timeout_seconds: int | None = None
    expired_at: Timestamp | None = None
    sandbox_level: SandboxLevel = SandboxLevel.NONE
    priority: QueuePriority = QueuePriority.NORMAL

    def ending_phrase(self) -> str:
        if self.expired_at is not None:
            return "timed out"
        return ENDING_PHRASES.get(self.state, f"{self.state.value} with exit code {self.exit_code}")

    def duration_text(self) -> str:
        began = self.started_at or self.created_at
        if began is None or self.ended_at is None:
            return ""
        minutes, seconds = divmod(round(began.elapsed_seconds(self.ended_at)), MINUTE_SECONDS)
        if not minutes:
            return f"{seconds} s"
        return f"{minutes} min {seconds} s" if seconds else f"{minutes} min"

    @property
    def succeeded(self) -> bool:
        return self.state is ProcessState.FINISHED and self.exit_code == 0

    @property
    def takes_part_in_queue(self) -> bool:
        return self.is_queue_run or self.slot_assigned or self.queued_at is not None

    def is_admitted_since(self, earlier: "Process") -> bool:
        """The queue gave this run its place since the earlier row was saved."""
        return earlier.queued_at is not None and self.queued_at is None and self.state in OPEN

    def has_expired_timeout(self, timestamp: Timestamp) -> bool:
        if self.timeout_seconds is None or self.started_at is None:
            return False
        return Duration(self.timeout_seconds).has_passed(self.started_at, timestamp)

    def background(self, timestamp: Timestamp, actor: Actor) -> "Process":
        return self.moved(ProcessLifecycle.background, moved_at=timestamp)

    @property
    def is_journal_merge(self) -> bool:
        return self.kind == ProcessKind.MERGE.value

    def finish(self, timestamp: Timestamp, actor: Actor, exit_code: int) -> "Process":
        return self.moved(ProcessLifecycle.finish, exit_code=exit_code, ended_at=timestamp, queued_at=None, slot_assigned=False, progress=FINISHED_PROGRESS)

    def fail(self, timestamp: Timestamp, actor: Actor, exit_code: int) -> "Process":
        return self.moved(ProcessLifecycle.fail, exit_code=exit_code, ended_at=timestamp, queued_at=None, slot_assigned=False)

    def stop(self, timestamp: Timestamp, actor: Actor) -> "Process":
        return self.moved(ProcessLifecycle.stop, ended_at=timestamp, queued_at=None, slot_assigned=False)

    def orphan(self, timestamp: Timestamp, actor: Actor) -> "Process":
        return self.moved(ProcessLifecycle.orphan, ended_at=timestamp, queued_at=None, slot_assigned=False)
