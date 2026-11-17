from types import SimpleNamespace

from journal.http.handler import Handler


def is_cross_site(**headers: str) -> bool:
    return Handler._is_cross_site(SimpleNamespace(headers={"Host": "journal.example.com", **headers}))


def test_a_write_the_browser_marks_as_from_another_site_is_refused():
    assert is_cross_site(**{"Sec-Fetch-Site": "cross-site"})
    assert is_cross_site(**{"Sec-Fetch-Site": "same-site"})
    assert is_cross_site(Origin="https://evil.example.org")
    assert is_cross_site(Origin="null")


def test_a_write_from_the_viewer_itself_or_a_command_with_no_origin_passes():
    assert not is_cross_site(**{"Sec-Fetch-Site": "same-origin"}, Origin="https://journal.example.com")
    assert not is_cross_site()
