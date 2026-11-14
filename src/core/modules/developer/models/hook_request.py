import json
from collections.abc import Mapping
from dataclasses import dataclass

from engine.types.type_guards import is_mapping
from engine.model.view_model import ViewModel
from core.modules.developer.models.support.views import HOOK_REQUEST_ROWS_SELECT
from engine.enums.hook_answer import HookAnswer


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
    agent_id: int
    category: str
    family: str
    headers_json: str
    body_json: str
    duration_ms: float
    queued_ms: float
    retries: int
    sender: str
    outcome: HookAnswer
    event: str
    tool: str
    part_count: int
    day: str
    time: str
    day_start: bool

    @property
    def number(self) -> int:
        return self.id

    @property
    def headers(self) -> Mapping[str, str]:
        decoded: object = json.loads(self.headers_json)
        return {str(name): str(value) for name, value in decoded.items()} if is_mapping(decoded) else {}

    @property
    def body(self) -> object:
        decoded: object = json.loads(self.body_json)
        return decoded

    def json(self) -> dict[str, object]:
        value = super().json()
        del value["headers_json"], value["body_json"]
        return {**value, "headers": self.headers, "body": self.body}
