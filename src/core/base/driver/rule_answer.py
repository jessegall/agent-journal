from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field, replace

from core.base.command.command import Command
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class RuleAnswer:
    """What one driver rule says about a hook: nothing, nudges, a refusal or a new input for the tool, with the
    commands the journal runs for it."""

    refusal: str = ""
    nudges: Sequence[Nudge] = ()
    commands: Sequence[Command[object]] = ()
    last: bool = False
    ends_layer: bool = False
    updated_input: Mapping[str, object] = field(default_factory=dict[str, object])
    input_after_commands: Callable[[Sequence[object]], Mapping[str, object]] | None = None

    @classmethod
    def allowed(cls) -> "RuleAnswer":
        return cls()

    @classmethod
    def with_nudges(cls, *nudges: Nudge) -> "RuleAnswer":
        return cls(nudges=nudges)

    @classmethod
    def refused(cls, nudge: Nudge) -> "RuleAnswer":
        return cls(refusal=nudge.text, nudges=(nudge,), last=True)

    @classmethod
    def rewritten(cls, tool_input: Mapping[str, object]) -> "RuleAnswer":
        return cls(updated_input=tool_input)

    @classmethod
    def final_allowance(cls, *nudges: Nudge) -> "RuleAnswer":
        return cls(nudges=nudges, last=True)

    def running(self, *commands: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, *commands])

    def rewriting_after_commands(self, build: Callable[[Sequence[object]], Mapping[str, object]]) -> "RuleAnswer":
        return replace(self, input_after_commands=build)

    def ending_layer(self, command: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, command], ends_layer=True)

    @property
    def line_nudges(self) -> tuple[Nudge, ...]:
        return tuple(nudge for nudge in self.nudges if nudge.text != self.refusal)

    @property
    def lines(self) -> tuple[str, ...]:
        return tuple(nudge.text for nudge in self.line_nudges)

    @property
    def rewrites(self) -> bool:
        return bool(self.updated_input) or self.input_after_commands is not None

    @property
    def is_final_allowance(self) -> bool:
        return self.last and not self.refusal

    @property
    def outcome(self) -> str:
        if self.refusal:
            return "refused"
        if self.lines:
            return "lines"
        return "rewritten" if self.rewrites else "allowed"
