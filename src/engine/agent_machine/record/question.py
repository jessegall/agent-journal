from dataclasses import dataclass

from engine.driver.hook_event import HookEvent
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
    def of(cls, event: HookEvent) -> "Question":
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
