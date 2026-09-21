from features.base import Feature
from features.journal import Journal
from features.ask_questions.details import QuestionsDetails
from features.ask_questions.handlers import AskInsteadOfProse, ReleaseOnceAsked


class Questions(Feature):
    details = QuestionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(AskInsteadOfProse())
        journal.events.handler(ReleaseOnceAsked())
