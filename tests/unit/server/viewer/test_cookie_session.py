from server.enums.session_type import SessionType
from server.viewer.share_link_session import ShareLinkSession
from server.viewer.viewer_login import ViewerLogin
from tests.unit.server.viewer.no_phones import NoPhones, NoShares

PHONE_PERSON_ID = 5


class CountingPhones(NoPhones):
    def __init__(self, paired_token: str) -> None:
        super().__init__()
        self.paired_token, self.lookups = paired_token, 0

    def person_id(self, token: str) -> int | None:
        self.lookups += 1
        return PHONE_PERSON_ID if token == self.paired_token else None


class CountingShares(NoShares):
    def __init__(self) -> None:
        super().__init__()
        self.lookups = 0

    def link(self, token: str) -> ShareLinkSession | None:
        self.lookups += 1
        return None


def test_a_request_without_a_session_cookie_looks_up_neither_the_phones_nor_the_shares():
    phones, shares = CountingPhones("phone"), CountingShares()
    assert ViewerLogin(phones, shares).cookie_session([]) is None
    assert (phones.lookups, shares.lookups) == (0, 0)


def test_a_phone_cookie_finds_its_session_with_one_lookup_in_the_phones_and_none_in_the_shares():
    phones, shares = CountingPhones("phone"), CountingShares()
    cookie = ViewerLogin(phones, shares).cookie_session(["phone"])
    assert cookie is not None and cookie.token == "phone" and cookie.session.type is SessionType.PHONE
    assert (phones.lookups, shares.lookups) == (1, 0)


def test_an_unknown_cookie_is_looked_up_once_in_the_phones_and_once_in_the_shares():
    phones, shares = CountingPhones("phone"), CountingShares()
    assert ViewerLogin(phones, shares).cookie_session(["unknown"]) is None
    assert (phones.lookups, shares.lookups) == (1, 1)
