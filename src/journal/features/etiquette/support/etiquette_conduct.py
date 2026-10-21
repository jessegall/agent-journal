import re

from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.turn_written import TurnWritten

SHOP_TALK = re.compile(r"\bjournal (task|plan|message|question|fact|rule|reminder|sequence|worker|check|skill|stuck|nothing) [a-z]+\b|\[journal\]", re.I)
THIRD_PERSON = re.compile(r"\bthe user\b", re.I)
EM_DASHES = re.compile(r"—.*—", re.S)
RUN_ON, SENTENCES = 400, 3


class EtiquetteConduct(Conduct):
    """The etiquette feature's conduct in every state: a turn for the user read once for shop talk, the third person, em dashes and run-on paragraphs, and the reminder what a journal line is every so many lines said."""

    def on_turn_written_etiquette(self, event: TurnWritten, settings: Settings) -> Transition:
        from journal.features.etiquette.feature import Etiquette
        if not event.final:
            return self.unchanged()
        found = [nudge.create() for pattern, nudge in ((SHOP_TALK, Etiquette.NO_SHOP_TALK), (THIRD_PERSON, Etiquette.SAY_YOU_NOT_THE_USER), (EM_DASHES, Etiquette.NO_EM_DASHES)) if pattern.search(event.text)]
        if runs_together(event.text):
            found.append(Etiquette.BLANK_LINES_BETWEEN_PARAGRAPHS.create())
        return self.unchanged(*found)

    def on_tool_finished_etiquette(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.etiquette.feature import Etiquette
        every = int(settings.of(Etiquette.REMIND_EVERY))
        if event.subagent or every <= 0 or event.snapshot.of(Etiquette).lines_since_reminder < every:
            return self.unchanged()
        return self.unchanged(Etiquette.A_LINE_IS_AN_INSTRUCTION.create())


def runs_together(text: str) -> bool:
    text = text.strip()
    return len(text) >= RUN_ON and "\n\n" not in text and text.count(". ") >= SENTENCES
