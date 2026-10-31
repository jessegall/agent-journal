from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.dumps.models.enums.item_state import ItemState


@dataclass(frozen=True, kw_only=True)
class DumpItem(Model):
    """One note of a dump, numbered in the dump from 1: what the agent noted of it, or what was done with it and
    the rows it became."""

    model_name = "dump_item"
    cli_name = "dump-item"

    dump_id: int
    creator_id: int
    position: int
    text: str
    state: ItemState = ItemState.NEW
    note: str = ""
    summary: str = ""
    refs: tuple[str, ...] = ()

    @property
    def line(self) -> str:
        match self.state:
            case ItemState.NEW:
                return f"{self.position}: not read yet"
            case ItemState.READ:
                return f"{self.position}: noted - {self.note}"
            case ItemState.FILED | ItemState.FAILED:
                refs = f" ({', '.join(self.refs)})" if self.refs else ""
                return f"{self.position}: {self.state.value} - {self.summary}{refs}"
