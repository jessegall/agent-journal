from dataclasses import dataclass

from engine.time.timestamp import Timestamp
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class DriverVersion(EnvironmentScoped, Model):
    """An environment's part of the answer basis: raised by every change of a driving setting, the
    driver or suite, a profile, a table digest, and a server boot, with the time of that boot, which no
    driving setting moves."""

    model_name = "driver_version"
    table = "driver_versions"
    cli_name = "driver-epoch"

    environment_id: int = 0
    epoch: int = 0
    started_at: Timestamp | None = None
