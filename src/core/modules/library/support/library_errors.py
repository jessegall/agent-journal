import json

from core.modules.library.support.library_denied import LibraryDenied
from core.modules.library.support.library_failure import LibraryFailure
from core.modules.library.support.library_item import LibraryItem
from core.modules.library.support.library_item_removed import LibraryItemRemoved
from core.modules.library.support.library_rejected import LibraryRejected
from core.modules.library.support.library_stale import LibraryStale
from core.modules.library.support.library_stopped import LibraryStopped
from core.modules.library.support.library_unreachable import LibraryUnreachable

STALE_CODE = 409
FAILURE_CLASSES: dict[int, type[LibraryFailure]] = {
    401: LibraryStopped, 426: LibraryStopped, 403: LibraryDenied, 400: LibraryRejected, 413: LibraryRejected, 428: LibraryRejected, 404: LibraryItemRemoved, 410: LibraryItemRemoved,
}


class LibraryFailures:
    """Sorts an error answer of the shared server into the failure it means, in one place; an answer that is
    not JSON, or has a code no group names, is unreachable."""

    @staticmethod
    def classify(code: int, body: bytes) -> LibraryFailure:
        try:
            answer = json.loads(body)
        except ValueError:
            return LibraryUnreachable.unreadable_page(code)
        if not isinstance(answer, dict):
            return LibraryUnreachable.unreadable_page(code)
        reason, suggestion = str(answer.get("error", f"the server answered {code}")), str(answer.get("hint", ""))
        if code == STALE_CODE:
            return LibraryFailures.stale(reason, suggestion, answer.get("current"))
        failure_class = FAILURE_CLASSES.get(code, LibraryUnreachable)
        return failure_class(reason, suggestion)

    @staticmethod
    def stale(reason: str, suggestion: str, current: object) -> LibraryFailure:
        try:
            return LibraryStale(reason, suggestion, LibraryItem.parsed(current))
        except LibraryUnreachable as unreadable:
            return unreadable
