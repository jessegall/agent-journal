"""The sessions of a journal and the seats they hold, reached through the record in hand."""

from agents.control import permit as press_permit
from engine.seats import live_session
from engine.sessions import Sessions


def sessions_of(record) -> Sessions:
    return Sessions(record.root)


def live_seat(record, title: str):
    """The session of that title and the seat it holds, or none."""
    return live_session(record.root, title)


def permit(record, env: str, session: str, allow: bool) -> dict:
    """Answers the permission an agent asks for in that environment, with the keys that press it."""
    return press_permit(record.root, env, session, allow)
