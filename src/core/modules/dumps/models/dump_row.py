from dataclasses import dataclass

from engine.model.view_model import ViewModel
from core.modules.dumps.models.support.views import DUMP_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class DumpRow(ViewModel):
    """A dump with its title, brief and outcome, or one of its items with its text, state and notes, read from
    the dump_rows view."""

    cli_name = "dump-row"
    view = "dump_rows"
    key = "row_key"
    select = DUMP_ROWS_SELECT

    row_key: str
    row_type: str
    dump_id: int
    item_id: int
    position: int
    title: str
    brief: str
    outcome: str
    text: str
    state: str
    note: str
    summary: str
    refs: str
