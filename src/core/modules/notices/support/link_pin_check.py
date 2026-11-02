import re
from dataclasses import replace
from datetime import timedelta

from core.base.clock import Clock
from core.base.driver.nudge import Nudge
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.base.type_guards import is_list, is_mapping
from core.modules.notices.models.notice import Notice
from core.modules.notices.support.notice_nudges import LINK_PIN_REQUEST, UNPINNED_CLAIM

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
LOCAL_ADDRESS = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]")
PIN_CLAIM = re.compile(r"\b(pinned (?:above|at the top|for you)|(?:i've|i have|i) pinned|(?:it's|it is|now) pinned)\b", re.IGNORECASE)
CLAIM_WINDOW_SECONDS = 60


class LinkPinCheck:
    """The line a text earns: words that claim a pin no pin in the last minute backs are pointed out, else the first
    link no open pin has is offered, each link on its own count. The link of a closed pin is offered again."""

    def __init__(self, queries: Queries, clock: Clock) -> None:
        self.queries, self.clock = queries, clock

    def nudges(self, environment_id: int, text: str) -> list[Nudge]:
        if self.claims_unmade_pin(environment_id, text):
            return [UNPINNED_CLAIM.nudge()]
        unpinned = self.first_unpinned(environment_id, text)
        if unpinned is None:
            return []
        nudge = LINK_PIN_REQUEST.nudge(url=unpinned)
        return [replace(nudge, key=f"{nudge.key}.{unpinned}")]

    def first_unpinned(self, environment_id: int, text: str) -> str | None:
        links = dict.fromkeys(url.rstrip(".,;:") for url in LINK.findall(text) if not LOCAL_ADDRESS.match(url))
        pins = self.queries.query(Notice).filter(environment_id=environment_id).matching(IsNull("closed_at"))
        return next((url for url in links if not pins.matching(Among("link", (url.rstrip("/"), f"{url.rstrip('/')}/"))).exists()), None)

    def claims_unmade_pin(self, environment_id: int, text: str) -> bool:
        if not PIN_CLAIM.search(text):
            return False
        window_start = Timestamp(self.clock.timestamp().value - timedelta(seconds=CLAIM_WINDOW_SECONDS)).text
        return not self.queries.query(Notice).filter(environment_id=environment_id).matching(Greater("created_at", window_start)).exists()

    def joined_text(self, value: object) -> str:
        if isinstance(value, str):
            return value
        if is_mapping(value):
            return "\n".join(self.joined_text(item) for item in value.values())
        return "\n".join(self.joined_text(item) for item in value) if is_list(value) else ""
