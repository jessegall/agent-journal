import json

import pytest

from core.modules.library.support.library_denied_error import LibraryDeniedError
from core.modules.library.support.library_failures import LibraryFailures
from core.modules.library.support.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.support.library_rejected_error import LibraryRejectedError
from core.modules.library.support.library_stale_error import LibraryStaleError
from core.modules.library.support.library_stopped_error import LibraryStoppedError
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError

ERROR_BODY = json.dumps({"error": "it failed", "hint": "try this"}).encode()
STALE_BODY = json.dumps({"error": "this item has changed", "hint": "compare",
                         "current": {"kind": "doc", "id": 12, "version": 10, "fields": {"title": "T"}, "updated_by": "Ada", "updated_at": "now"}}).encode()


@pytest.mark.parametrize(("code", "group"), [
    (401, LibraryStoppedError), (426, LibraryStoppedError), (403, LibraryDeniedError), (400, LibraryRejectedError), (413, LibraryRejectedError), (428, LibraryRejectedError),
    (404, LibraryItemRemovedError), (410, LibraryItemRemovedError), (302, LibraryUnreachableError), (418, LibraryUnreachableError), (500, LibraryUnreachableError), (502, LibraryUnreachableError),
])
def test_each_status_code_lands_in_its_group(code, group):
    failure = LibraryFailures.classify(code, ERROR_BODY)
    assert type(failure) is group
    assert (failure.reason, failure.suggestion) == ("it failed", "try this")


def test_a_conflict_carries_the_newest_item():
    failure = LibraryFailures.classify(409, STALE_BODY)
    assert isinstance(failure, LibraryStaleError)
    assert (failure.current.item_id, failure.current.version, failure.current.fields) == (12, 10, {"title": "T"})


def test_a_conflict_without_a_readable_item_is_unreachable():
    assert type(LibraryFailures.classify(409, ERROR_BODY)) is LibraryUnreachableError


@pytest.mark.parametrize("body", [b"<html>Bad gateway</html>", b"", b"[1, 2]", b"\xff\xfe"])
@pytest.mark.parametrize("code", [401, 403, 404, 409, 500])
def test_a_body_that_is_not_a_json_object_is_unreachable_whatever_the_code(code, body):
    assert type(LibraryFailures.classify(code, body)) is LibraryUnreachableError
