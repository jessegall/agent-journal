from dataclasses import dataclass, replace

from engine.fields import Loaded

COUNTED = ("edited", "created", "deleted", "added", "removed")
TYPED = "Typed"
NOTED = "Journal"


@dataclass(frozen=True)
class Delta(Loaded):
    edited: int = 0
    created: int = 0
    deleted: int = 0
    added: int = 0
    removed: int = 0

    def to_json(self) -> dict:
        return {key: getattr(self, key) for key in COUNTED}

    def plus(self, other: "Delta") -> "Delta":
        return Delta(**{key: getattr(self, key) + getattr(other, key) for key in COUNTED})

    @property
    def changed_files(self) -> bool:
        return bool(self.edited or self.created or self.deleted)


@dataclass(frozen=True)
class Outcome(Loaded):
    ok: bool | None = None
    passed: int = 0
    failed: int = 0
    pull: str = ""
    url: str = ""
    number: str = ""

    def to_json(self) -> dict:
        if self.pull:
            return {"pull": self.pull, "url": self.url, "number": self.number}
        if self.ok is not None:
            return {"ok": self.ok}
        return {"passed": self.passed, "failed": self.failed}


@dataclass(frozen=True)
class CommandRun(Loaded):
    command: str = ""
    tool: str = ""
    at: float = 0.0
    done: float = 0.0
    effect: str = ""
    subject: str = ""
    files: tuple = ()
    made: tuple = ()
    changed: Delta | None = None
    result: Outcome | None = None
    before: "CommandRun | None" = None

    def to_json(self) -> dict:
        kept = {"command": self.command, "tool": self.tool, "at": self.at, "done": self.done, "effect": self.effect, "subject": self.subject,
                "files": list(self.files), "made": list(self.made), "changed": self.changed.to_json() if self.changed else None,
                "result": self.result.to_json() if self.result else None, "before": self.before.to_json() if self.before else None}
        return {key: value for key, value in kept.items() if value}

    @property
    def by_hand(self) -> bool:
        return self.tool not in ("", "Bash")

    @property
    def could_write(self) -> bool:
        return self.tool in ("", "Bash", "Edit", "Write", "MultiEdit", "NotebookEdit")

    @property
    def finished(self) -> "CommandRun | None":
        return self if self.done else self.before

    def counted(self, delta: Delta, touched: list, made: list) -> "CommandRun":
        return replace(self, changed=self.changed.plus(delta) if self.changed else delta,
                       files=(*self.files, *(p for p in touched if p not in self.files)), made=(*self.made, *(p for p in made if p not in self.made)))


def current_run(row) -> CommandRun:
    return CommandRun.from_json(row.running)


def command_runs(row) -> list[CommandRun]:
    return [CommandRun.from_json(one) for one in row.commands]
