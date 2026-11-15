from dataclasses import dataclass

from engine.agent_stack.subject_reference import SubjectReference


@dataclass(frozen=True)
class NeedKey:
    """The identity of a need and of its frame: the state class, the subject and the generation it belongs to."""

    state_name: str
    subject: SubjectReference | None
    generation: str
