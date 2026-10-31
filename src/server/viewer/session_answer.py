from dataclasses import dataclass

from server.viewer.session_type import SessionType


@dataclass(frozen=True)
class SessionAnswer:
    """What GET /api/session tells the shell about the cookie: its session type and the person it acts for."""

    type: SessionType
    person_id: int | None
