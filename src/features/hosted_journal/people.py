from collections.abc import Callable
from typing import TYPE_CHECKING, Protocol

from engine.extension import Extension
from engine.record import Record
from features.hosted_journal.owner import KeptLogin
from resources.base import OWNER_ID, Resource

if TYPE_CHECKING:
    from features.hosted_journal.gateway import Gateway, Visit

PEOPLE = Extension()

PageHandler = Callable[["Visit"], None]
Act = Callable[["Visit", KeptLogin], None]


class People(Protocol):
    """The people besides the owner that the login page lets in, and what each of them reaches."""

    def below_login(self) -> str: ...

    def pages(self, gateway: "Gateway") -> dict[tuple[str, str], PageHandler]: ...

    def actions(self, gateway: "Gateway") -> dict[tuple[str, str], Act]: ...

    def owner_actions(self, gateway: "Gateway") -> dict[tuple[str, str], PageHandler]: ...

    def refusal(self, visit: "Visit", login: KeptLogin) -> str | None: ...

    def marks(self, visit: "Visit", login: KeptLogin) -> dict: ...

    def enters(self, record: Record, member: str) -> bool: ...

    def may_reach(self, record: Record, member: str, page) -> bool: ...

    def sees(self, record: Record, member: str, row: Resource) -> bool: ...

    def headers(self, record: Record, member: str) -> dict: ...


class NoMembers:
    """Only the owner logs in."""

    def below_login(self) -> str:
        return ""

    def pages(self, gateway: "Gateway") -> dict[tuple[str, str], PageHandler]:
        return {}

    def actions(self, gateway: "Gateway") -> dict[tuple[str, str], Act]:
        return {}

    def owner_actions(self, gateway: "Gateway") -> dict[tuple[str, str], PageHandler]:
        return {}

    def refusal(self, visit: "Visit", login: KeptLogin) -> str | None:
        return "only this journal's owner logs in here"

    def marks(self, visit: "Visit", login: KeptLogin) -> dict:
        return {}

    def enters(self, record: Record, member: str) -> bool:
        return member == OWNER_ID

    def may_reach(self, record: Record, member: str, page) -> bool:
        return member == OWNER_ID

    def sees(self, record: Record, member: str, row: Resource) -> bool:
        return member == OWNER_ID

    def headers(self, record: Record, member: str) -> dict:
        return {}


def people_of(record: Record) -> People:
    return next(iter(PEOPLE.each(record)), NoMembers())
