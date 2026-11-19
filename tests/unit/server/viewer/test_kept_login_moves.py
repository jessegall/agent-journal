import json
from contextlib import contextmanager

from server.viewer.kept_login_moves import CLEARED, MOVES, TABLE_EXISTS, KeptLoginMoves
from server.viewer.session_file import SessionFile


class MovesDatabase:
    """Answers the login moves' reads from a fixed map of moves, and clears it when asked."""

    def __init__(self, moves: dict[int, int] | None) -> None:
        self.moves = moves

    def rows(self, statement):
        if statement is TABLE_EXISTS:
            return [{"n": int(self.moves is not None)}]
        assert statement is MOVES
        return [{"old_id": old_id, "new_id": new_id} for old_id, new_id in self.moves.items()]

    def update(self, statement) -> int:
        assert statement is CLEARED
        cleared = len(self.moves)
        self.moves = {}
        return cleared

    @contextmanager
    def transaction(self):
        yield


def test_kept_person_logins_follow_the_people_an_upgrade_moved_and_the_moves_are_cleared(tmp_path):
    path = tmp_path / "viewer-sessions.json"
    path.write_text(json.dumps({"first": 56, "second": 7, "agent": {"agent": 56}}))
    database = MovesDatabase({56: 1000054})

    assert KeptLoginMoves(database, SessionFile(path)).moved()

    assert json.loads(path.read_text()) == {"first": 1000054, "second": 7, "agent": {"agent": 56}}
    assert database.moves == {}
    assert not KeptLoginMoves(database, SessionFile(path)).moved()


def test_a_database_without_moves_leaves_the_logins_alone(tmp_path):
    path = tmp_path / "viewer-sessions.json"
    path.write_text(json.dumps({"first": 56}))

    assert not KeptLoginMoves(MovesDatabase(None), SessionFile(path)).moved()
    assert json.loads(path.read_text()) == {"first": 56}
