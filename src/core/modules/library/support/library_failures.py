import json

from core.modules.library.errors.library_denied_error import LibraryDeniedError
from core.modules.library.errors.library_failure_error import LibraryFailureError
from core.modules.library.support.library_item_body import LibraryItemBody
from core.modules.library.errors.library_item_removed_error import LibraryItemRemovedError
from core.modules.library.errors.library_rejected_error import LibraryRejectedError
from core.modules.library.errors.library_stale_error import LibraryStaleError
from core.modules.library.errors.library_stopped_error import LibraryStoppedError
from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError

STALE_CODE = 409
FAILURE_CLASSES: dict[int, type[LibraryFailureError]] = {
    401: LibraryStoppedError, 426: LibraryStoppedError, 403: LibraryDeniedError, 400: LibraryRejectedError, 413: LibraryRejectedError, 428: LibraryRejectedError, 404: LibraryItemRemovedError, 410: LibraryItemRemovedError,
}


class LibraryFailures:
    """Sorts an error answer of the shared server into the failure it means, in one place; an answer that is
    not JSON, or has a code no group names, is unreachable."""

    @staticmethod
    def classify(code: int, body: bytes) -> LibraryFailureError:
        try:
            answer = json.loads(body)
        except ValueError:
            return LibraryUnreachableError.unreadable_page(code)
        if not LibraryAnswer.is_object(answer):
            return LibraryUnreachableError.unreadable_page(code)
        reason, suggestion = str(answer.get("error", f"the server answered {code}")), str(answer.get("hint", ""))
        if code == STALE_CODE:
            return LibraryFailures.stale(reason, suggestion, answer.get("current"))
        failure_class = FAILURE_CLASSES.get(code, LibraryUnreachableError)
        return failure_class(reason, suggestion)

    @staticmethod
    def stale(reason: str, suggestion: str, current: object) -> LibraryFailureError:
        try:
            return LibraryStaleError(reason, suggestion, LibraryItemBody.parsed(current))
        except LibraryUnreachableError as unreadable:
            return unreadable
