from pathlib import Path

from core.base.journal_home import JournalHome
from server.viewer.session_type import SessionType
from server.viewer.session_route import SessionRoute
from server.viewer.viewer_login import ViewerLogin
from tests.unit.server.viewer.no_phones import NoPhones, NoShares

PERSON_ID = 7
MISSING_HOME = JournalHome(Path("/nowhere"))


def test_a_person_session_answers_its_kind_and_person():
    login = ViewerLogin(NoPhones(), NoShares())
    token = login.session_token(login.new_key(PERSON_ID))
    reply = SessionRoute(login, MISSING_HOME).answer(token)
    assert (reply.type, reply.person_id) == (SessionType.PERSON, PERSON_ID)


def test_a_phone_session_answers_the_phone_kind_and_its_person():
    login = ViewerLogin(NoPhones(), NoShares())
    token = login.session_token(login.new_key(PERSON_ID, SessionType.PHONE))
    reply = SessionRoute(login, MISSING_HOME).answer(token)
    assert (reply.type, reply.person_id) == (SessionType.PHONE, PERSON_ID)
