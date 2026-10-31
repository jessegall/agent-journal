from dataclasses import dataclass

from core.base.timestamp import Timestamp
from server.viewer.session_type import SessionType


@dataclass(frozen=True)
class ViewerSession:
    """One login's session: its kind, and the person it acts for or the share it shows and when that share ends."""

    type: SessionType
    person_id: int | None = None
    share_id: int | None = None
    ends_at: Timestamp | None = None
