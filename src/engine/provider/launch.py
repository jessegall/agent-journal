from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path

from engine.provider.session_start import SessionStart


@dataclass(frozen=True)
class Launch:
    """What the journal starts an agent program with: the journal's root, the folder the program runs in,
    its model, its launch name, the session it starts, the variables the journal sets in its environment,
    whether it skips the program's permission prompts, the arguments the person gave for the program, the
    first prompt it starts its first turn with, so a person who opens it needs to type nothing, and the effort a
    resumed session last ran with."""

    root: Path
    folder: Path
    model: str
    launch: str
    session: SessionStart
    variables: Mapping[str, str]
    skip_prompts: bool = field(default=True, kw_only=True)
    program_arguments: Sequence[str] = field(default=(), kw_only=True)
    first_prompt: str = field(default="", kw_only=True)
    effort: str = field(default="", kw_only=True)

    @property
    def prompt_arguments(self) -> Sequence[str]:
        return [self.first_prompt] if self.first_prompt else []

    def names_flag(self, flag: str) -> bool:
        return any(argument == flag or argument.startswith(f"{flag}=") for argument in self.program_arguments)
