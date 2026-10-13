import os

from controllers.base import SAVE_MARKS
from framework.base import Feature
from events.answers import Allowed, Rewritten
from events.asking import TextFormatting
from expects import Answered, Given
from framework.format import SHARED, VIEWER
from features.hosted_journal.feature import APART
from features.hosted_journal.people import PEOPLE
from framework.journal import Journal
from features.members.details import MembersDetails
from features.members.gate import MemberLogins
from features.members.words import MemberWords, ReadMarkedWordsPlainly, WrittenBy

MARKED = '<untrusted member="ada">Ship it on Friday</untrusted>'
PLAIN = "Ship it on Friday"


class MembersFeature(Feature):
    details = MembersDetails

    def register(self, journal: Journal) -> None:
        # A login page started apart trusts no switch in the record, so its members stay known to it.
        guarding = None if os.environ.get(APART) == "1" else self
        PEOPLE.add(guarding, MemberLogins())
        SAVE_MARKS.add(None, MemberWords())
        SAVE_MARKS.add(None, WrittenBy())
        journal.events.answer(TextFormatting, ReadMarkedWordsPlainly(), expects=[
            Given(TextFormatting(text=MARKED, surface=VIEWER)) >> Answered(Rewritten(PLAIN)),
            Given(TextFormatting(text=MARKED, surface=SHARED), settings={".members": False}) >> Answered(Rewritten(PLAIN)),
            Given(TextFormatting(text=MARKED, surface="")) >> Answered(Allowed()),
        ])
