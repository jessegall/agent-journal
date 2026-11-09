from core.base.library.library_item import LibraryItem
from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


class LibraryItemBody:
    """Reads an item out of what the shared server answered; an answer without the fields of an item is unreachable."""

    @staticmethod
    def parsed(body: object) -> LibraryItem:
        fields = LibraryAnswer.fields(body)
        try:
            return LibraryItem(str(fields["kind"]), LibraryAnswer.number(fields["id"]), LibraryAnswer.number(fields["version"]), LibraryAnswer.fields(fields["fields"]), str(fields.get("creator", "")),
                               str(fields.get("updated_by", "")), str(fields.get("updated_at", "")), str(fields.get("removed_at", "")))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error
