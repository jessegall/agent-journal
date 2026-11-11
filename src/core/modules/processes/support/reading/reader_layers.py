from collections.abc import Iterable

from engine.actor.actor import CORE_ACTOR_ID
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.enums.reader_layer import ReaderLayer


class ReaderLayers:
    """Orders the readers that match a command: project before plugin before stock, the default first inside a
    layer, then the newest. A stock reader a person or an agent edited counts as a project reader."""

    def __init__(self, edited_stock_ids: frozenset[int]) -> None:
        self.edited_stock_ids = edited_stock_ids

    def ordered(self, readers: Iterable[Reader]) -> list[Reader]:
        return sorted(readers, key=lambda reader: (self.layer(reader), not reader.is_default, -reader.id))

    def layer(self, reader: Reader) -> ReaderLayer:
        if reader.plugin_name:
            return ReaderLayer.PLUGIN
        if reader.creator_id == CORE_ACTOR_ID and reader.id not in self.edited_stock_ids:
            return ReaderLayer.STOCK
        return ReaderLayer.PROJECT
