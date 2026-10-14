from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from features.triggers.watching import WATCHING, firing
from framework.recital import answered_words
from receiving import Answerer
from resources.triggers import DENY, Trigger
from serving import ReadRows, Settings


class DenyWhatTheAgentDoes(Answerer[ToolCallAsked]):
    def answer(self, request: ToolCallAsked, triggers: ReadRows[Trigger], settings: Settings) -> Answer:
        if request.subagent or not settings.is_on(WATCHING):
            return Allowed()
        row = next((row for row in firing(triggers, lambda scope: answered_words(request, scope)) if row.does == DENY), None)
        return Refused(f"{row.title} - {row.wording or 'this call is denied by a trigger'}") if row else Allowed()
