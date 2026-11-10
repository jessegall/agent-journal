from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.support.views import WAITING_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class WaitingRow(ViewModel):
    """An open wait that waits on the user, with the rows it waits on, read from the waiting_rows view."""

    cli_name = "wait"
    view = "waiting_rows"
    key = "id"
    select = WAITING_ROWS_SELECT

    id: int
    focus: str
    state: WaitState
    opened_at: Timestamp
    targets: str
