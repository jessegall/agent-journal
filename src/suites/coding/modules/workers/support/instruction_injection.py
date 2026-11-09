from dataclasses import dataclass


@dataclass(frozen=True)
class InstructionInjection:
    """One block of text a profile can have in its instruction files: its key, the title of its switch, its text and
    whether it is on for the profile."""

    key: str
    title: str
    text: str
    enabled: bool
