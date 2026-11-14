from dataclasses import dataclass
import shutil

from engine.library.library_hits import LibraryHits
from engine.library.library_lookup import LibraryLookup
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


def test_the_library_module_binds_its_own_lookup(journal):
    assert type(journal.container.get(LibraryLookup)).__name__ == 'ServerLibraryLookup'


def test_with_no_connection_a_search_answers_nothing(journal):
    lookup = journal.container.get(LibraryLookup)
    assert lookup.hits(['release'], ['doc', 'sequence', 'check']) == LibraryHits()
    assert lookup.title('doc', 1) is None
