from dataclasses import dataclass

from core.base.model.model import Model
from core.base.model.removable import Removable
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp

CHECK_TITLE_LIMIT_CHARACTERS = 200


@dataclass(frozen=True, kw_only=True)
class Check(Removable, Model):
    """A command that proves a point, run by hand or every so many minutes: it keeps whether it last passed,
    what it printed, when it ran, how far a running command has come and when the agent was last told it
    fails; it can be stopped or removed."""

    model_name = "check"
    cli_name = "check"
    search_fields = ["title", "brief", "command"]

    creator_id: int
    title: str
    command: str
    brief: str = ""
    interval_minutes: int = 0
    last_passed: bool | None = None
    last_output: str = ""
    last_run_at: Timestamp | None = None
    reported_at: Timestamp | None = None
    stopped: bool = False
    removed_at: Timestamp | None = None
    task_wait_id: int | None = None
    hidden: bool = False
    run_percent: int | None = None

    def __post_init__(self) -> None:
        if not 1 <= len(self.title) <= CHECK_TITLE_LIMIT_CHARACTERS:
            raise Refusal(f"a check's title is 1 to {CHECK_TITLE_LIMIT_CHARACTERS} characters, not {len(self.title)}", "say it shorter")
        if not self.command.strip():
            raise Refusal("a check needs a command", "give it with --command")
        if self.interval_minutes < 0:
            raise Refusal("--every is a number of minutes, 0 or more", "0 runs it by hand only")

    @property
    def is_running(self) -> bool:
        return not self.stopped and self.removed_at is None

    @property
    def state(self) -> str:
        """Whether the check runs, was stopped or was removed, as one plain word for a button condition."""
        if self.removed_at is not None:
            return "removed"
        return "stopped" if self.stopped else "running"

    @property
    def status(self) -> str:
        if self.removed_at is not None:
            return "removed"
        if self.stopped:
            return "stopped"
        return {None: "not run", True: "passed", False: "failed"}[self.last_passed]
