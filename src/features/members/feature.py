import os

from features.base import Feature
from features.hosted_journal.feature import APART
from features.hosted_journal.people import PEOPLE
from features.journal import Journal
from features.members.details import MembersDetails
from features.members.gate import MemberLogins


class MembersFeature(Feature):
    details = MembersDetails

    def register(self, journal: Journal) -> None:
        # A login page started apart trusts no switch in the record, so its members stay known to it.
        guarding = None if os.environ.get(APART) == "1" else self
        PEOPLE.add(guarding, MemberLogins())
