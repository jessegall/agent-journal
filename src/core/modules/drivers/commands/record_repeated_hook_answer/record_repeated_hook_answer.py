from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordRepeatedHookAnswer(Command[None]):
    """Records on a hook call the refusal that overrode its stored answer when the same hook came again."""

    hook_call_id: int
    refusal: str
