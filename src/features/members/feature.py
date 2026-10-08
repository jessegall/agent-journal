import os

from controllers.base import SAVE_MARKS
from features.base import Feature
from features.format import DOWNLOAD, FORMATTERS, SHARED, VIEWER
from features.hosted_journal.feature import APART
from features.hosted_journal.people import PEOPLE
from features.journal import Journal
from features.members.details import MembersDetails
from features.members.gate import MemberLogins
from features.members.words import MemberWords, unmarked


class MembersFeature(Feature):
    details = MembersDetails

    def register(self, journal: Journal) -> None:
        # A login page started apart trusts no switch in the record, so its members stay known to it.
        guarding = None if os.environ.get(APART) == "1" else self
        PEOPLE.add(guarding, MemberLogins())
        SAVE_MARKS.add(None, MemberWords())
        # People read a member's words plainly, even with the feature off; agents read them marked.
        FORMATTERS.add(None, (unmarked, (VIEWER, SHARED, DOWNLOAD)))
