from engine.extension import Extension
from engine.record import Record

MEMBER_RIGHTS = Extension()


class MemberRights:
    """What a member's phone may do and see; a member nothing grants anything to gets nothing."""

    def may_reach(self, record: Record, member: str, page) -> bool:
        return False

    def sees(self, record: Record, member: str, row) -> bool:
        return False


def rights_of(record: Record) -> MemberRights:
    named = [given(record) for given in MEMBER_RIGHTS.each(record)]
    return named[-1] if named else MemberRights()
