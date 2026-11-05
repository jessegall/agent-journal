from collections.abc import Mapping
from dataclasses import dataclass, replace

from core.modules.processes.models.reader import Reader


@dataclass(frozen=True)
class StockReaderRows:
    readers: Mapping[str, Reader]
    edited_ids: frozenset[int]

    def saved(self, reader: Reader) -> "StockReaderRows":
        return replace(self, readers={**self.readers, reader.name: reader})
