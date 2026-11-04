import json

import pytest

from core.modules.library.support.library_denied import LibraryDenied
from core.modules.library.support.library_errors import LibraryFailures
from core.modules.library.support.library_item_removed import LibraryItemRemoved
from core.modules.library.support.library_rejected import LibraryRejected
from core.modules.library.support.library_stale import LibraryStale
from core.modules.library.support.library_stopped import LibraryStopped
from core.modules.library.support.library_unreachable import LibraryUnreachable

ERROR_BODY = json.dumps({"error": "it failed", "hint": "try this"}).encode()
STALE_BODY = json.dumps({"error": "this item has changed", "hint": "compare",
                         "current": {"kind": "doc", "id": 12, "version": 10, "fields": {"title": "T"}, "updated_by": "Ada", "updated_at": "now"}}).encode()


@pytest.mark.parametrize(("code", "group"), [
    (401, LibraryStopped), (426, LibraryStopped), (403, LibraryDenied), (400, LibraryRejected), (413, LibraryRejected), (428, LibraryRejected),
    (404, LibraryItemRemoved), (410, LibraryItemRemoved), (302, LibraryUnreachable), (418, LibraryUnreachable), (500, LibraryUnreachable), (502, LibraryUnreachable),
])
def test_each_status_code_lands_in_its_group(code, group):
    failure = LibraryFailures.classify(code, ERROR_BODY)
    assert type(failure) is group
    assert (failure.reason, failure.suggestion) == ("it failed", "try this")


def test_a_conflict_carries_the_newest_item():
    failure = LibraryFailures.classify(409, STALE_BODY)
    assert isinstance(failure, LibraryStale)
    assert (failure.current.item_id, failure.current.version, failure.current.fields) == (12, 10, {"title": "T"})


def test_a_conflict_without_a_readable_item_is_unreachable():
    assert type(LibraryFailures.classify(409, ERROR_BODY)) is LibraryUnreachable


@pytest.mark.parametrize("body", [b"<html>Bad gateway</html>", b"", b"[1, 2]", b"\xff\xfe"])
@pytest.mark.parametrize("code", [401, 403, 404, 409, 500])
def test_a_body_that_is_not_a_json_object_is_unreachable_whatever_the_code(code, body):
    assert type(LibraryFailures.classify(code, body)) is LibraryUnreachable
