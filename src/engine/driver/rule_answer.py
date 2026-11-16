from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, field, replace

from engine.command.command import Command
from engine.driver.agent_hook import AgentHook
from engine.driver.block_condition import BlockCondition
from engine.driver.open_hold import OpenHold
from engine.driver.interval import Interval
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_message_type import AgentMessageType


@dataclass(frozen=True)
class RuleAnswer:
    """What one part of a hook's answer says: nothing, agent messages, a refusal or a new input for the tool, with
    the commands the journal runs for it, and the commands it runs only when no rule refused the hook."""

    refusal: str = ""
    agent_messages: Sequence[AgentMessage] = ()
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
    def with_agent_messages(cls, *agent_messages: AgentMessage) -> "RuleAnswer":
        return cls(agent_messages=agent_messages)

    @classmethod
    def refused(cls, agent_message: AgentMessage) -> "RuleAnswer":
        return cls(refusal=agent_message.text, agent_messages=(agent_message,), last=True)

    def role_variant(self, role: str) -> "RuleAnswer":
        agent_messages = tuple(agent_message.role_variant(role) for agent_message in self.agent_messages)
        if all(new is old for new, old in zip(agent_messages, self.agent_messages)):
            return self
        refusal = next((new.text for new, old in zip(agent_messages, self.agent_messages) if old.text == self.refusal), self.refusal)
        return replace(self, agent_messages=agent_messages, refusal=refusal)

    @classmethod
    def rewritten(cls, tool_input: Mapping[str, object]) -> "RuleAnswer":
        return cls(updated_input=tool_input)

    @classmethod
    def final_allowance(cls, *agent_messages: AgentMessage) -> "RuleAnswer":
        return cls(agent_messages=agent_messages, last=True)

    @classmethod
    def blocked(cls, hook: AgentHook, agent_message: AgentMessage, condition: BlockCondition) -> "RuleAnswer":
        tool = hook.event.tool
        answer = cls.allowed() if tool is None or tool.block_exempt else cls.refused(agent_message)
        return answer.running(OpenHold(hook.agent_id, agent_message, condition))

    @classmethod
    def refusals(cls, agent_messages: Sequence[AgentMessage]) -> "RuleAnswer":
        return cls(refusal="\n".join(agent_message.text for agent_message in agent_messages), agent_messages=tuple(agent_messages), last=True)

    @classmethod
    def refused_with_block(cls, hook: AgentHook, agent_message: AgentMessage, condition: BlockCondition) -> "RuleAnswer":
        return cls.refused(agent_message).running(OpenHold(hook.agent_id, agent_message, condition))

    def blocking_after(self, hook: AgentHook, agent_message: AgentMessage, condition: BlockCondition, after: Interval, countdown: AgentMessage, strict: bool = False) -> "RuleAnswer":
        return self.running(OpenHold(hook.agent_id, agent_message, condition, after, countdown, strict=strict))

    def running(self, *commands: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, *commands])

    def running_unrefused(self, *commands: Command[object]) -> "RuleAnswer":
        return replace(self, commands_unrefused=[*self.commands_unrefused, *commands])

    def rewriting_after_commands(self, build: Callable[[Sequence[object]], Mapping[str, object]]) -> "RuleAnswer":
        return replace(self, input_after_commands=build)

    def ending_layer(self, command: Command[object]) -> "RuleAnswer":
        return replace(self, commands=[*self.commands, command], ends_layer=True)

    @property
    def line_agent_messages(self) -> tuple[AgentMessage, ...]:
        return tuple(agent_message for agent_message in self.agent_messages if agent_message.text != self.refusal)

    @property
    def lines(self) -> tuple[str, ...]:
        return tuple(agent_message.text for agent_message in self.line_agent_messages)

    @property
    def rewrites(self) -> bool:
        return bool(self.updated_input) or self.input_after_commands is not None

    @property
    def is_final_allowance(self) -> bool:
        return self.last and not self.refusal

    @property
    def is_safety_refusal(self) -> bool:
        return bool(self.refusal) and any(agent_message.type is AgentMessageType.SAFETY_REFUSAL for agent_message in self.agent_messages)

    @property
    def outcome(self) -> str:
        if self.refusal:
            return "refused"
        if self.lines:
            return "lines"
        return "rewritten" if self.rewrites else "allowed"
