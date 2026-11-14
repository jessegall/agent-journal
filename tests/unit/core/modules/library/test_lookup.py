from dataclasses import dataclass
import shutil

from engine.container.container import Container
from engine.library.library_hits import LibraryHits
from engine.library.library_lookup import LibraryLookup
from engine.library.library_ref import LibraryRef
from tests.stories.core.modules.secrets.support.private_home import private_folder
import pytest

__all__ = ["private_folder"]
pytestmark = pytest.mark.usefixtures("private_folder")
JSON_HEADERS = {"Content-Type": "application/json"}
EMPTY_PAGE = b'{"page": 1, "size": 30, "total": 0, "rows": []}'
ASKS = 10
REQUIRES_COMPILER = pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build")


@dataclass(frozen=True)
class Tokens:
    """The tokens of the two users the real server was started with."""

    admin: str
    editor: str


def test_a_lookup_with_no_library_module_bound_answers_nothing():
    lookup = Container().get(LibraryLookup)
    assert type(lookup) is LibraryLookup
    assert lookup.hits(['release'], ['doc']) == LibraryHits()
    assert lookup.item('doc', LibraryRef(1)) is None
    assert lookup.title('doc', 1) is None
    assert lookup.is_copy('doc', 1) is False
