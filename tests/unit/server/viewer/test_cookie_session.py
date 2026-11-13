from server.enums.session_type import SessionType
from server.viewer.share_link_session import ShareLinkSession
from server.viewer.viewer_login import ViewerLogin
from tests.unit.server.viewer.no_phones import NoPhones, NoShares

PHONE_PERSON_ID = 5


class CountingPhones(NoPhones):
    def __init__(self, paired_token: str) -> None:
        super().__init__()
        self.paired_token, self.asked = paired_token, 0

    def person_id(self, token: str) -> int | None:
        self.asked += 1
        return PHONE_PERSON_ID if token == self.paired_token else None


class CountingShares(NoShares):
    def __init__(self) -> None:
        super().__init__()
        self.asked = 0

    def link(self, token: str) -> ShareLinkSession | None:
        self.asked += 1
        return None


def test_a_request_without_a_session_cookie_asks_neither_the_phones_nor_the_shares():
    phones, shares = CountingPhones("phone"), CountingShares()
    found = ViewerLogin(phones, shares).cookie_session([])
    assert found.session is None and found.token == ""
    assert (phones.asked, shares.asked) == (0, 0)


def test_a_phone_cookie_finds_its_session_with_one_ask_of_the_phones_and_none_of_the_shares():
    phones, shares = CountingPhones("phone"), CountingShares()
    found = ViewerLogin(phones, shares).cookie_session(["phone"])
    assert found.token == "phone" and found.session is not None and found.session.type is SessionType.PHONE
    assert (phones.asked, shares.asked) == (1, 0)


def test_an_unknown_cookie_asks_the_phones_and_the_shares_once_each():
    phones, shares = CountingPhones("phone"), CountingShares()
    found = ViewerLogin(phones, shares).cookie_session(["unknown"])
    assert found.session is None and found.token == ""
    assert (phones.asked, shares.asked) == (1, 1)
