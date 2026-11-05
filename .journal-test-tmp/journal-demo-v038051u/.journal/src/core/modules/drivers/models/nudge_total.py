from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.drivers.models.support.views import NUDGE_TOTALS_SELECT


@dataclass(frozen=True, kw_only=True)
class NudgeTotal(ViewModel):
    """How often a nudge was said to all agents and when it was said last, read from the nudge_totals view."""

    cli_name = "nudge-total"
    view = "nudge_totals"
    key = "nudge_key"
    select = NUDGE_TOTALS_SELECT

    nudge_key: str
    delivery_count: int
    last_delivered_at: str
