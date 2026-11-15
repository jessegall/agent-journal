from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class DriverEpoch(Model):
    """An environment's part of the answer basis: raised by every change of a driving setting, a live slice, the
    driver or suite, a profile, a table digest, and a server boot."""

    model_name = "driver_epoch"
    cli_name = "driver-epoch"

    environment_id: int
    epoch: int = 0
