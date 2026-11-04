from core.base.library.library_item import LibraryItem
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


class LibraryItemBody:
    """Reads an item out of what the shared server answered; an answer without the fields of an item is unreachable."""

    @staticmethod
    def parsed(body: object) -> LibraryItem:
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            return LibraryItem(str(body["kind"]), int(body["id"]), int(body["version"]), dict(body["fields"]), str(body.get("creator", "")), str(body.get("updated_by", "")),
                               str(body.get("updated_at", "")), str(body.get("removed_at", "")))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error
