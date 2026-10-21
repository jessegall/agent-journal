import re

from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.turn_displayed import TurnDisplayed

SHOP_TALK = re.compile(r"\bjournal (task|plan|message|question|fact|rule|reminder|sequence|worker|check|skill|stuck|nothing) [a-z]+\b|\[journal\]", re.I)
THIRD_PERSON = re.compile(r"\bthe user\b", re.I)
EM_DASHES = re.compile(r"—.*—", re.S)
LONG_PARAGRAPH_CHARACTERS, SENTENCES = 400, 3


class EtiquetteConduct(Conduct):
    """The etiquette feature's conduct in every state: a turn for the user read once for shop talk, the third person, em dashes and run-on paragraphs, and the reminder what a journal line is every so many lines said."""

    def on_turn_displayed(self, event: TurnDisplayed, settings: Settings) -> Transition:
        from journal.features.etiquette.feature import Etiquette
        if not event.final:
            return self.none()
        rows = [nudge.create() for pattern, nudge in ((SHOP_TALK, Etiquette.SHOP_TALK_WARNING), (THIRD_PERSON, Etiquette.SECOND_PERSON), (EM_DASHES, Etiquette.EM_DASH_WARNING)) if pattern.search(event.content)]
        if runs_together(event.content):
            rows.append(Etiquette.PARAGRAPH_SPACING.create())
        return self.none(*rows)

    def on_tool_finished(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.etiquette.feature import Etiquette
        all_items = settings.integer(Etiquette.REMINDER_INTERVAL)
        if event.subagent or all_items <= 0 or event.data.part(Etiquette).reminder_gap < all_items:
            return self.none()
        return self.none(Etiquette.JOURNAL_LINE_RULE.create())


def runs_together(text: str) -> bool:
    text = text.strip()
    return len(text) >= LONG_PARAGRAPH_CHARACTERS and "\n\n" not in text and text.count(". ") >= SENTENCES
