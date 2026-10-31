from collections.abc import Sequence
from dataclasses import dataclass, replace

from core.base.command.command import Command


@dataclass(frozen=True)
class RuleAnswer:
    """What one driver rule says about a hook: nothing, lines, or a refusal, with the commands the journal runs
    for it."""

    refusal: str = ""
    lines: Sequence[str] = ()
    commands: Sequence[Command[object]] = ()
    last: bool = False
    ends_layer: bool = False

    @classmethod
    def allowed(cls) -> "RuleAnswer":
        return cls()

    @classmethod
    def with_lines(cls, *lines: str) -> "RuleAnswer":
        return cls(lines=lines)

    @classmethod
    def refused(cls, line: str) -> "RuleAnswer":
        return cls(refusal=line, last=True)

    @classmethod
    def final_allowance(cls, *lines: str) -> "RuleAnswer":
        return cls(lines=lines, last=True)

    def running(self, *commands: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, *commands])

    def ending_layer(self, command: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, command], ends_layer=True)

    @property
    def is_final_allowance(self) -> bool:
        return self.last and not self.refusal

    @property
    def outcome(self) -> str:
        if self.refusal:
            return "refused"
        return "lines" if self.lines else "allowed"
