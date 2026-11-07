import pytest

from core.base.refusal import Refusal
from core.modules.library.support.library_address import LibraryAddress


@pytest.mark.parametrize(("text", "expected"), [
    ("10.0.0.5", "https://10.0.0.5:8740"),
    ("library.example.com", "https://library.example.com:8740"),
    ("10.0.0.5:9000", "https://10.0.0.5:9000"),
    ("library.example.com:9000", "https://library.example.com:9000"),
    ("https://library.example.com", "https://library.example.com"),
    ("http://10.0.0.5:9000", "http://10.0.0.5:9000"),
    ("HTTPS://Library.Example.com/", "https://library.example.com"),
    ("[::1]", "https://[::1]:8740"),
    ("[::1]:9000", "https://[::1]:9000"),
    ("http://[2001:db8::1]:9000", "http://[2001:db8::1]:9000"),
    ("example.com/library", "https://example.com:8740/library"),
    ("https://example.com/library/", "https://example.com/library"),
    ("  10.0.0.5  ", "https://10.0.0.5:8740"),
])
def test_an_address_becomes_the_base_every_request_starts_with(text, expected):
    assert LibraryAddress(text).base == expected


@pytest.mark.parametrize("text", ["", "   ", "ftp://library.example.com", "https://", "10.0.0.5:port", "10.0.0.5:99999", "::1", "https://example.com?x=1", "https://example.com#top"])
def test_bad_input_is_refused_with_what_to_write(text):
    with pytest.raises(Refusal) as error:
        LibraryAddress(text).base
    assert "no server address" in error.value.reason
    assert "10.0.0.5" in error.value.suggestion
