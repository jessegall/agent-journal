import json
from collections.abc import Mapping
from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.developer.models.support.views import HOOK_REQUEST_ROWS_SELECT
from core.modules.drivers.models.enums.hook_answer import HookAnswer


@dataclass(frozen=True, kw_only=True)
class HookRequest(ViewModel):
    """A completed request with its display columns and original headers and body."""

    cli_name = "hook-request"
    view = "hook_request_rows"
    key = "id"
    select = HOOK_REQUEST_ROWS_SELECT
    shared_rows = True

    id: int
    received_at: str
    program: str
    headers_json: str
    body_json: str
    duration_ms: float
    outcome: HookAnswer
    event: str
    tool: str
    day: str
    time: str
    day_start: bool

    @property
    def number(self) -> int:
        return self.id

    @property
    def headers(self) -> Mapping[str, str]:
        return json.loads(self.headers_json)

    @property
    def body(self) -> object:
        return json.loads(self.body_json)

    def json(self) -> dict[str, object]:
        value = super().json()
        del value["headers_json"], value["body_json"]
        return {**value, "headers": self.headers, "body": self.body}
