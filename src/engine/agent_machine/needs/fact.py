from dataclasses import dataclass

from engine.agent_stack.subject_reference import SubjectReference


@dataclass(frozen=True)
class Fact:
    """A typed statement read from rows that asks for no state by itself, such as a usage limit, a failed
    launch or the share of the context in use; a fact source declares its own subclasses."""

    subject: SubjectReference | None
