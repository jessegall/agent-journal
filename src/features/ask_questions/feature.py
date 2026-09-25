from features.base import Feature
from features.journal import Journal
from features.ask_questions.details import QuestionsDetails
from features.ask_questions.handlers import AskInsteadOfProse, MarkTheAnswer, ReleaseOnceAnswered, ReleaseOnceAsked
from features.ask_questions.interceptors import AskInTheJournal, OptionsOnlyInTheirButtons


class Questions(Feature):
    details = QuestionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(AskInsteadOfProse())
        journal.events.handler(ReleaseOnceAsked())
        journal.events.handler(ReleaseOnceAnswered())
        journal.events.handler(MarkTheAnswer())
        journal.agent.interceptor(AskInTheJournal())
        journal.commands.intercept("create", OptionsOnlyInTheirButtons())
