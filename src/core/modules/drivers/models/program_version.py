from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ProgramVersion(Model):
    """An agent program's part of the answer basis: raised when its usage lockdown begins or ends."""

    model_name = "program_version"
    cli_name = "program-version"

    program: str
    change_count: int = 0
