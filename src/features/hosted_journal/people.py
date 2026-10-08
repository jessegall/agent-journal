from collections.abc import Callable
from typing import TYPE_CHECKING, Protocol

from engine.extension import Extension
from engine.record import Record
from features.hosted_journal.owner import KeptLogin

if TYPE_CHECKING:
    from features.hosted_journal.gateway import Gateway, Visit

PEOPLE = Extension()

Page = Callable[["Visit"], None]
Act = Callable[["Visit", KeptLogin], None]


class People(Protocol):
    """The people besides the owner that the login page lets in, and what each of them reaches."""

    def below_login(self) -> str: ...

    def pages(self, gateway: "Gateway") -> dict[tuple[str, str], Page]: ...

    def actions(self, gateway: "Gateway") -> dict[tuple[str, str], Act]: ...

    def owner_actions(self, gateway: "Gateway") -> dict[tuple[str, str], Page]: ...

    def refusal(self, visit: "Visit", login: KeptLogin) -> str | None: ...


class NoMembers:
    """Only the owner logs in."""

    def below_login(self) -> str:
        return ""

    def pages(self, gateway: "Gateway") -> dict[tuple[str, str], Page]:
        return {}

    def actions(self, gateway: "Gateway") -> dict[tuple[str, str], Act]:
        return {}

    def owner_actions(self, gateway: "Gateway") -> dict[tuple[str, str], Page]:
        return {}

    def refusal(self, visit: "Visit", login: KeptLogin) -> str | None:
        return "only this journal's owner logs in here"


def people_of(record: Record) -> People:
    return next(iter(PEOPLE.each(record)), NoMembers())
