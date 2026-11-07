from dataclasses import dataclass
from collections.abc import Mapping

from core.base.model.view_model import ViewModel
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.support.views import HOOK_CALL_ROWS_SELECT


@dataclass(frozen=True, kw_only=True)
class HookCallRow(ViewModel):
    """A hook call as the activity and transcript windows draw it, read from the hook_call_rows view without
    its bodies."""

    cli_name = "hook-call"
    view = "hook_call_rows"
    key = "id"
    select = HOOK_CALL_ROWS_SELECT

    id: int
    session_agent_id: int
    hook: str
    tool: str
    summary: str
    answer: HookAnswer
    refusal: str
    stop_checks: tuple[Mapping[str, object], ...] = ()
