from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class DriverTable(Model):
    """A driver's compiled table as sync wrote it, by digest, with the manifest of every contribution key; for audit
    and to show what changed between two digests, never run from."""

    model_name = "driver_table"
    cli_name = "driver-table"

    driver_name: str
    digest: str
    compiled_at: Timestamp
    manifest: str = "[]"
