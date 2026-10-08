from dataclasses import dataclass
from enum import StrEnum
from typing import assert_never

from features.members.allow_list import read, written
from features.phone.allow_list import Action, Page
from resources.base import Refused

READ = "Read every page of this journal"
WRITE = "Write messages, to-dos, comments and documents, and answer questions"
OWNERS_ALONE = ("Run commands, start agents or change the code", "Change settings, features and plugins", "Invite people or change what they can do")
OWNERS = "Only the owner can, on the owner's own server."
NOT_A_WRITER = "Your role is reader; the owner can make you a writer."


@dataclass(frozen=True)
class Limit:
    """Something a person may not do in the journal, and why."""

    text: str
    why: str


@dataclass(frozen=True)
class Abilities:
    """What a person can do in the journal, and what they cannot."""

    can: tuple[str, ...]
    cannot: tuple[Limit, ...]


class Role(StrEnum):
    """What a member may do in the journal: read it, or also write its shared rows."""

    WRITER = "writer"
    READER = "reader"

    @classmethod
    def named(cls, value: str) -> "Role":
        if value not in cls._value2member_map_:
            raise Refused(f"there is no role {value}; a member is a writer or a reader")
        return cls(value)

    def reaches(self, target: Page | Action) -> bool:
        return read(target) or (self is Role.WRITER and written(target))

    def refusal(self) -> str:
        match self:
            case Role.WRITER:
                return "Writers add and change messages, to-dos, comments and documents. Everything else stays with the owner."
            case Role.READER:
                return "Readers read this journal and change nothing in it. The owner can make you a writer."
            case _:
                assert_never(self)

    def abilities(self) -> Abilities:
        owners = tuple(Limit(text, OWNERS) for text in OWNERS_ALONE)
        match self:
            case Role.WRITER:
                return Abilities((READ, WRITE), owners)
            case Role.READER:
                return Abilities((READ,), (Limit(WRITE, NOT_A_WRITER), *owners))
            case _:
                assert_never(self)


OWNER_ABILITIES = Abilities((READ, WRITE, *OWNERS_ALONE), ())
