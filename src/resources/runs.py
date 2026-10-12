"""What an agent ran, as it is stored on its row: a provider builds these and a feature reads them back, so neither owns them."""

from dataclasses import asdict, dataclass, field

from resources.fields import Loaded


@dataclass(frozen=True)
class Exited:
    """How a journal command came back: its exit code and what it printed, or on a failure the reason it gave."""

    code: int
    output: str = ""


@dataclass
class BackgroundTasks:
    started: dict[str, float] = field(default_factory=dict)
    ended: dict[str, float] = field(default_factory=dict)
    failed: set[str] = field(default_factory=set)
    commands: dict[str, str] = field(default_factory=dict)
    detached: dict[str, int] = field(default_factory=dict)
    printed: dict[str, float] = field(default_factory=dict)
    used: dict[str, str] = field(default_factory=dict)
    outputs: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class Finish:
    """How a background run ended: the word its notification used, when it ended, and the exit code it reported, which is the part that says whether the run passed."""

    status: str = ""
    at: float = 0.0
    code: int | None = None

    def said(self) -> str:
        """What the run came to, for the agent to read: the exit code decides, and a run that reported none is only said to have ended."""
        if self.code is None:
            return self.status or "ended"
        return f"{self.status}, passed" if self.code == 0 else f"{self.status}, failed with exit code {self.code}"


@dataclass(frozen=True)
class CommandRow(Loaded):
    id: str = ""
    task_id: str = ""
    command: str = ""
    task: str = ""
    running: bool = False
    at: float = 0.0
    ended: float = 0.0
    status: str = ""
    code: int | None = None

    def to_json(self) -> dict:
        return asdict(self)

    def answers(self, ref: str) -> bool:
        """Whether this is the run someone waits on, named either by the id its launch answered with or by the tool use's own."""
        return ref in (self.task_id, self.id)

    def named(self) -> str:
        """What to call it: what it was asked to do, or the command itself."""
        return self.task or self.command

    def came_to(self) -> str:
        """What it came to, for the agent to read."""
        return Finish(self.status, self.at, self.code).said()
