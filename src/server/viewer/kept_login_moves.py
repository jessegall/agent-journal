from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON
from engine.database.statement import Statement
from server.viewer.session_file import SessionFile
from server.enums.session_type import SessionType
from server.viewer.viewer_session import ViewerSession

TABLE_EXISTS = Statement("SELECT count(*) AS n FROM sqlite_master WHERE type = 'table' AND name = 'moved_people'", scan_reason=SCHEMA_REASON)
MOVES = Statement("SELECT old_id, new_id FROM moved_people", scan_reason="the few people an upgrade moved to new ids")
CLEARED = Statement("DELETE FROM moved_people")


class KeptLoginMoves:
    """Carries the browser logins kept in the session file over to the ids an upgrade moved their people to, once,
    so a login never names an id that now belongs to an agent."""

    def __init__(self, database: Database, sessions: SessionFile) -> None:
        self.database, self.sessions = database, sessions

    def moved(self) -> bool:
        if not int(self.database.rows(TABLE_EXISTS)[0]["n"]):
            return False
        moves = {int(row["old_id"]): int(row["new_id"]) for row in self.database.rows(MOVES)}
        if not moves:
            return False
        kept = self.sessions.load()
        self.sessions.save({token: self.moved_session(session, moves) for token, session in kept.items()})
        with self.database.transaction():
            self.database.update(CLEARED)
        return True

    @staticmethod
    def moved_session(session: ViewerSession, moves: dict[int, int]) -> ViewerSession:
        if session.type is not SessionType.PERSON or session.person_id not in moves:
            return session
        return ViewerSession(SessionType.PERSON, person_id=moves[session.person_id])
