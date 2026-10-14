from events import Fact
from events.templates import TemplateChosen, TemplateToRead
from features.templates.instructions import INSTRUCTIONS
from receiving import Handler
from serving import Chat, Elsewhere


class StartFromTheTemplate(Handler[TemplateChosen]):
    def handle(self, event: TemplateChosen, elsewhere: Elsewhere) -> list[Fact]:
        rows = elsewhere.here().rows_named(event.type)
        for title, body in event.sections:
            rows.add_part(event.n, title, body)
        rows.link(event.n, event.ref)
        return []


class TellTheInstructions(Handler[TemplateToRead]):
    def handle(self, event: TemplateToRead, chat: Chat) -> list[Fact]:
        chat.nudge(INSTRUCTIONS, n=event.n, title=event.title, brief=event.brief)
        return []
