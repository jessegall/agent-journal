from typing import TypeIs

from core.base.type_guards import is_list
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


class LibraryAnswer:
    """Takes one named part out of what the shared server answered; an answer without it is unreachable."""

    @staticmethod
    def is_object(value: object) -> TypeIs[dict[str, object]]:
        return isinstance(value, dict)

    @staticmethod
    def is_text_or_number(value: object) -> TypeIs[str | int | float]:
        return isinstance(value, (str, int, float))

    @staticmethod
    def fields(body: object) -> dict[str, object]:
        if not LibraryAnswer.is_object(body):
            raise LibraryUnreachableError.unreadable()
        return body

    @staticmethod
    def number(value: object) -> int:
        if not LibraryAnswer.is_text_or_number(value):
            raise LibraryUnreachableError.unreadable()
        return int(value)

    @staticmethod
    def member(body: object, name: str) -> object:
        if not LibraryAnswer.is_object(body) or name not in body:
            raise LibraryUnreachableError.unreadable()
        return body[name]

    @staticmethod
    def members(body: object, name: str) -> list[object]:
        part = LibraryAnswer.member(body, name)
        if not is_list(part):
            raise LibraryUnreachableError.unreadable()
        return part
