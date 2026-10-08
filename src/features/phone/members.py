from engine.extension import Extension
from engine.record import Record
from resources.base import OWNER_ID

MEMBER_RIGHTS = Extension()


class MemberRights:
    """What a person's phone may do and see when no members feature answers: the owner's everything, a member's nothing."""

    def may_reach(self, record: Record, member: str, page) -> bool:
        return member == OWNER_ID

    def sees(self, record: Record, member: str, row) -> bool:
        return member == OWNER_ID

    def headers(self, record: Record, member: str) -> dict:
        """What the login page tells the journal of a request from this person's phone; nothing for the owner's."""
        return {}


def rights_of(record: Record) -> MemberRights:
    named = [given(record) for given in MEMBER_RIGHTS.each(record)]
    return named[-1] if named else MemberRights()
