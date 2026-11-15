from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class ProgramEpoch(Model):
    """An agent program's part of the answer basis: raised when its usage lockdown begins or ends."""

    model_name = "program_epoch"
    table = "program_epochs"
    cli_name = "program-epoch"

    program: str
    epoch: int = 0
