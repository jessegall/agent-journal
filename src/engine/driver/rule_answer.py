from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field, replace

from engine.command.command import Command
from engine.driver.agent_hook import AgentHook
from engine.driver.block_condition import BlockCondition
from engine.driver.block_until import BlockUntil
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge
from engine.enums.nudge_type import NudgeType


@dataclass(frozen=True)
class RuleAnswer:
    """What one driver rule says about a hook: nothing, nudges, a refusal or a new input for the tool, with
    the commands the journal runs for it, and the commands it runs only when no rule refused the hook."""

    refusal: str = ""
    nudges: Sequence[Nudge] = ()
    commands: Sequence[Command[object]] = ()
    commands_unrefused: Sequence[Command[object]] = ()
    last: bool = False
    ends_layer: bool = False
    updated_input: Mapping[str, object] = field(default_factory=dict[str, object])
    input_after_commands: Callable[[Sequence[object]], Mapping[str, object]] | None = None
    source_name: str = ""
    refusal_priority: int = 0
    dropped_lines: int = 0
    terminal: str = ""
    reason: str = ""

    @classmethod
    def allowed(cls, reason: str = "") -> "RuleAnswer":
        return cls(reason=reason)

    @classmethod
    def with_nudges(cls, *nudges: Nudge) -> "RuleAnswer":
        return cls(nudges=nudges)

    @classmethod
    def refused(cls, nudge: Nudge) -> "RuleAnswer":
        return cls(refusal=nudge.text, nudges=tuple([nudge]), last=True)

    def role_variant(self, role: str) -> "RuleAnswer":
        nudges = tuple(nudge.role_variant(role) for nudge in self.nudges)
        if all(new is old for new, old in zip(nudges, self.nudges)):
            return self
        refusal = next((new.text for new, old in zip(nudges, self.nudges) if old.text == self.refusal), self.refusal)
        return replace(self, nudges=nudges, refusal=refusal)

    @classmethod
    def rewritten(cls, tool_input: Mapping[str, object]) -> "RuleAnswer":
        return cls(updated_input=tool_input)

    @classmethod
    def final_allowance(cls, *nudges: Nudge) -> "RuleAnswer":
        return cls(nudges=nudges, last=True)

    @classmethod
    def blocked(cls, hook: AgentHook, nudge: Nudge, condition: BlockCondition) -> "RuleAnswer":
        tool = hook.event.tool
        answer = cls.allowed() if tool is None or tool.block_exempt else cls.refused(nudge)
        return answer.running(BlockUntil(hook.agent_id, nudge, condition))

    @classmethod
    def refused_for_each(cls, nudges: Sequence[Nudge]) -> "RuleAnswer":
        return cls(refusal="\n".join(nudge.text for nudge in nudges), nudges=tuple(nudges), last=True)

    @classmethod
    def refused_with_block(cls, hook: AgentHook, nudge: Nudge, condition: BlockCondition) -> "RuleAnswer":
        return cls.refused(nudge).running(BlockUntil(hook.agent_id, nudge, condition))

    def blocking_after(self, hook: AgentHook, nudge: Nudge, condition: BlockCondition, after: Interval, countdown: Nudge, strict: bool = False) -> "RuleAnswer":
        return self.running(BlockUntil(hook.agent_id, nudge, condition, after, countdown, strict=strict))

    def running(self, *commands: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, *commands])

    def running_unrefused(self, *commands: Command[object]) -> "RuleAnswer":
        return replace(self, commands_unrefused=[*self.commands_unrefused, *commands])

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
    def is_safety_refusal(self) -> bool:
        return bool(self.refusal) and any(nudge.type is NudgeType.SAFETY_REFUSAL for nudge in self.nudges)

    @property
    def outcome(self) -> str:
        if self.refusal:
            return "refused"
        if self.lines:
            return "lines"
        return "rewritten" if self.rewrites else "allowed"
