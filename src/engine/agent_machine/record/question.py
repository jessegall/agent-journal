from dataclasses import dataclass, replace

from engine.driver.hook_event import HookEvent
from engine.driver.shell_line import ShellLine
from engine.driver.tool import Tool
from engine.enums.hook_event_name import HookEventName
from engine.enums.question_type import QuestionType

QUESTION_TYPES = {HookEventName.PRE_TOOL_USE: QuestionType.TOOL_CALL, HookEventName.STOP: QuestionType.STOP, HookEventName.PROMPT: QuestionType.PROMPT}


@dataclass(frozen=True)
class Question:
    """What a step is asked: an action (a tool call, a stop or a prompt) that may be refused, an observation
    that asks no permission, or nothing for a step outside a hook."""

    question_type: QuestionType
    event: HookEvent | None = None

    @classmethod
    def posed(cls, event: HookEvent) -> "Question":
        return cls(QUESTION_TYPES.get(event.event, QuestionType.OBSERVATION), event)

    @classmethod
    def none(cls) -> "Question":
        return cls(QuestionType.NONE)

    def is_stop(self) -> bool:
        return self.question_type is QuestionType.STOP

    def is_tool_call(self) -> bool:
        return self.question_type is QuestionType.TOOL_CALL

    def is_action(self) -> bool:
        return self.question_type in QUESTION_TYPES.values()

    def tool(self) -> Tool | None:
        return self.event.tool if self.event is not None else None

    def with_shell(self, shell: ShellLine) -> "Question":
        assert self.event is not None and self.event.tool is not None, "only a tool call's question has a shell line"
        return replace(self, event=replace(self.event, tool=replace(self.event.tool, shell=shell)))

    def fingerprint(self) -> str:
        tool = self.tool()
        if tool is None:
            return self.question_type
        return f"{tool.name}:{' '.join(tool.shell.part_texts) if tool.shell is not None else ','.join(tool.files)}"
