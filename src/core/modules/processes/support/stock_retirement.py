from collections.abc import Collection

from engine.actor.actor import CORE_ACTOR_ID
from core.modules.processes.models.reader import Reader


class StockRetirement:
    """Whether a stock reader row goes when its entry left the shipped list: only a row the core made and nobody
    edited; an edited row is the project's now, and a reader someone else made is never touched."""

    @staticmethod
    def retires(row: Reader, shipped_names: Collection[str], edited: bool) -> bool:
        return row.creator_id == CORE_ACTOR_ID and row.name not in shipped_names and not edited
