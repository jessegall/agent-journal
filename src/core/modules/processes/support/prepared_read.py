from dataclasses import dataclass

from core.modules.processes.models.output import Output
from core.modules.processes.support.reader_advance import ReaderAdvance


@dataclass(frozen=True)
class PreparedRead:
    """What a reader made of an output before the write opened, with the output as it stood then."""

    output: Output
    advance: ReaderAdvance
