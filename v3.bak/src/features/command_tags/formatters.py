from events.answers import Answer, Rewritten
from events.asking import TextFormatting
from features.command_tags.reading import reader, visible
from receiving import Answerer
from serving import Settings


class StripTags(Answerer[TextFormatting]):
    def answer(self, request: TextFormatting, settings: Settings) -> Answer:
        return Rewritten(visible(request.text, reader(settings)))
