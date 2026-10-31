from server.viewer.session_type import SessionType
from server.viewer.session_route import SessionRoute
from server.viewer.viewer_login import ViewerLogin

PERSON_ID = 7


def test_a_person_session_answers_its_kind_and_person():
    login = ViewerLogin()
    token = login.session_token(login.new_key(PERSON_ID))
    answer = SessionRoute(login).answer(token)
    assert (answer.type, answer.person_id) == (SessionType.PERSON, PERSON_ID)


def test_a_phone_session_answers_the_phone_kind_and_its_person():
    login = ViewerLogin()
    token = login.session_token(login.new_key(PERSON_ID, SessionType.PHONE))
    answer = SessionRoute(login).answer(token)
    assert (answer.type, answer.person_id) == (SessionType.PHONE, PERSON_ID)
