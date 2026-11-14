from unittest.mock import MagicMock

from server.viewer.session_file import SessionFile
from server.enums.session_type import SessionType
from server.viewer.viewer_login import ViewerLogin


def test_a_person_session_stays_after_the_login_is_made_again(tmp_path):
    kept = SessionFile(tmp_path / "sessions.json")
    login = ViewerLogin(MagicMock(), MagicMock(), kept)
    token = login.session_token(login.new_key(7))
    restarted_login = ViewerLogin(MagicMock(), MagicMock(), kept)
    assert restarted_login.has_session(token) and restarted_login.session(token).person_id == 7


def test_the_file_of_sessions_is_read_by_its_owner_only(tmp_path):
    kept = SessionFile(tmp_path / "sessions.json")
    login = ViewerLogin(MagicMock(), MagicMock(), kept)
    login.session_token(login.new_key(1))
    assert (tmp_path / "sessions.json").stat().st_mode & 0o077 == 0


def test_an_unreadable_file_gives_no_sessions(tmp_path):
    (tmp_path / "sessions.json").write_text("not json")
    assert SessionFile(tmp_path / "sessions.json").load() == {}


def test_the_main_agents_session_stays_an_agent_session_after_a_restart(tmp_path):
    kept = SessionFile(tmp_path / "sessions.json")
    login = ViewerLogin(MagicMock(), MagicMock(), kept)
    token = login.session_token(login.new_key(78, SessionType.AGENT))
    session = ViewerLogin(MagicMock(), MagicMock(), kept).session(token)
    assert session.type is SessionType.AGENT and session.person_id == 78


def test_a_share_session_is_not_kept_in_the_file(tmp_path):
    kept = SessionFile(tmp_path / "sessions.json")
    login = ViewerLogin(MagicMock(), MagicMock(), kept)
    login.session_token(login.new_share_key(4))
    assert kept.load() == {}
