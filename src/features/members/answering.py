from events.answers import Allowed, Answer, Rewritten
from events.asking import TextFormatting
from framework.format import DOWNLOAD, SHARED, VIEWER
from framework.words import unmarked
from receiving import Answerer


class ReadMarkedWordsPlainly(Answerer[TextFormatting]):
    """People read a member's words plainly, even with the feature off; agents read them marked."""

    always = True
    surfaces = (VIEWER, SHARED, DOWNLOAD)

    def answer(self, request: TextFormatting) -> Answer:
        return Rewritten(unmarked(request.text)) if request.surface in self.surfaces else Allowed()
