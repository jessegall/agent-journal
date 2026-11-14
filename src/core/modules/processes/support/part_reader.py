from dataclasses import dataclass

from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader import Reader


@dataclass(frozen=True)
class PartReader:
    """A reader and the part of a run whose output it reads."""

    reader: Reader
    part: ProcessPart
