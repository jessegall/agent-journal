from datetime import datetime, timedelta, timezone

import pytest

from core.base.timestamp import Timestamp

from server.viewer.session_type import SessionType
from server.viewer.share_link_session import ShareLinkSession
from server.viewer.shared_row import SharedRow
from server.viewer.share_session_error import ShareSessionError
from server.viewer.viewer_login import ViewerLogin
from tests.unit.server.viewer.no_phones import NoPhones, NoShares

PERSON_ID = 7
SHARE_ID = 3


def opened(login: ViewerLogin, key: str) -> str:
    return login.session_token(key)


def test_a_person_key_opens_a_person_session_of_that_person():
    login = ViewerLogin(NoPhones(), NoShares())
    token = opened(login, login.new_key(PERSON_ID))
    assert login.session(token).type is SessionType.PERSON
    assert login.person_id(token) == PERSON_ID


def test_a_phone_key_opens_a_phone_session_that_acts_for_its_person():
    login = ViewerLogin(NoPhones(), NoShares())
    token = opened(login, login.new_key(PERSON_ID, SessionType.PHONE))
    assert login.session(token).type is SessionType.PHONE
    assert login.person_id(token) == PERSON_ID


def test_a_share_key_opens_a_share_session_naming_its_share():
    login = ViewerLogin(NoPhones(), NoShares())
    token = opened(login, login.new_share_key(SHARE_ID))
    assert login.session(token).type is SessionType.SHARE
    assert login.session(token).share_id == SHARE_ID
    assert login.has_session(token)


def test_a_share_session_is_refused_where_a_person_is_needed():
    login = ViewerLogin(NoPhones(), NoShares())
    token = opened(login, login.new_share_key(SHARE_ID))
    with pytest.raises(ShareSessionError):
        login.person_id(token)


class OneLink(NoShares):
    """Share sessions that know one link, ended or not."""

    def __init__(self, state: str) -> None:
        self.state = state

    def link(self, token: str) -> ShareLinkSession | None:
        return ShareLinkSession(SHARE_ID, PERSON_ID, self.state, Timestamp(datetime.now(timezone.utc) + timedelta(days=1)), SharedRow("plan", 1, 1)) if token == "link" else None


def test_a_link_opens_a_share_session_again_and_again_naming_its_share_and_end():
    login = ViewerLogin(NoPhones(), OneLink("active"))
    for _ in range(2):
        session = login.share_session("link")
        assert session is not None and session.type is SessionType.SHARE and session.share_id == SHARE_ID and session.ends_at is not None
    assert login.has_session("link")


def test_a_revoked_or_unknown_link_opens_no_session():
    assert ViewerLogin(NoPhones(), OneLink("revoked")).share_session("link") is None
    assert ViewerLogin(NoPhones(), OneLink("active")).share_session("other") is None
