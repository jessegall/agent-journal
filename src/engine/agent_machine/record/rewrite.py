from collections.abc import Mapping
from dataclasses import dataclass

from engine.agent_machine.record.question import Question
from engine.enums.transform_slot import TransformSlot


@dataclass(frozen=True)
class Rewrite:
    """The tool input as the transforms left it: unchanged, or replaced by one new input with the slots that
    changed it and the result of judging the final action again."""

    tool_input: Mapping[str, object] | None = None
    slots: tuple[TransformSlot, ...] = ()
    validation: str = ""

    @classmethod
    def unchanged(cls) -> "Rewrite":
        return cls()

    @classmethod
    def replaced(cls, tool_input: Mapping[str, object], slots: tuple[TransformSlot, ...], validation: str) -> "Rewrite":
        return cls(tool_input, slots, validation)

    def changed(self) -> bool:
        return self.tool_input is not None

    def final_question(self, question: Question) -> Question:
        return question
