from dataclasses import dataclass

from engine.time.timestamp import Timestamp
from server.viewer.shared_row import SharedRow
from server.enums.session_type import SessionType


@dataclass(frozen=True)
class ViewerSession:
    """One login's session: its type, and the user it acts for or the share it shows and when that share
    ends."""

    type: SessionType
    person_id: int | None = None
    share_id: int | None = None
    ends_at: Timestamp | None = None
    shared: SharedRow | None = None
    comments: bool = False
