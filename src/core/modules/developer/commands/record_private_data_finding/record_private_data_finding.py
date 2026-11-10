from dataclasses import dataclass

from engine.command.command import Command
from core.modules.developer.models.private_data_mark import PrivateDataMark


@dataclass(frozen=True)
class RecordPrivateDataFinding(Command[PrivateDataMark]):
    """Records one place the private data scan found, for the environment in scope."""

    finding_key: str
    text: str
