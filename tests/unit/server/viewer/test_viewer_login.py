import pytest

from server.viewer.session_type import SessionType
from server.viewer.share_session_error import ShareSessionError
from server.viewer.viewer_login import ViewerLogin
from tests.unit.server.viewer.no_phones import NoPhones

PERSON_ID = 7
SHARE_ID = 3


def opened(login: ViewerLogin, key: str) -> str:
    return login.session_token(key)


def test_a_person_key_opens_a_person_session_of_that_person():
    login = ViewerLogin(NoPhones())
    token = opened(login, login.new_key(PERSON_ID))
    assert login.session(token).type is SessionType.PERSON
    assert login.person_id(token) == PERSON_ID


def test_a_phone_key_opens_a_phone_session_that_acts_for_its_person():
    login = ViewerLogin(NoPhones())
    token = opened(login, login.new_key(PERSON_ID, SessionType.PHONE))
    assert login.session(token).type is SessionType.PHONE
    assert login.person_id(token) == PERSON_ID


def test_a_share_key_opens_a_share_session_naming_its_share():
    login = ViewerLogin(NoPhones())
    token = opened(login, login.new_share_key(SHARE_ID))
    assert login.session(token).type is SessionType.SHARE
    assert login.session(token).share_id == SHARE_ID
    assert login.has_session(token)


def test_a_share_session_is_refused_where_a_person_is_needed():
    login = ViewerLogin(NoPhones())
    token = opened(login, login.new_share_key(SHARE_ID))
    with pytest.raises(ShareSessionError):
        login.person_id(token)
