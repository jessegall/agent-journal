from dataclasses import dataclass

from server.viewer.session_type import SessionType


@dataclass(frozen=True)
class ViewerSession:
    """One login's session: its kind, and the person it acts for or the share it shows."""

    type: SessionType
    person_id: int | None = None
    share_id: int | None = None
