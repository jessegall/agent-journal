from features.base import Feature
from features.journal import Journal
from features.ask_questions.details import AskQuestionsDetails
from features.ask_questions.handlers import AskInsteadOfProse, DismissSettledQuestions, MarkTheAnswer, ReleaseOnceAnswered, ReleaseOnceAsked, open_a_day
from features.nudges import Nudge
from features.ask_questions.interceptors import AskInTheJournal, OptionsOnlyInTheirButtons


class AskQuestions(Feature):
    details = AskQuestionsDetails
    nudges = (Nudge("settled", behaviour="settled", about=open_a_day),)

    def register(self, journal: Journal) -> None:
        journal.events.handler(AskInsteadOfProse())
        journal.events.handler(ReleaseOnceAsked())
        journal.events.handler(ReleaseOnceAnswered())
        journal.events.handler(MarkTheAnswer())
        journal.events.handler(DismissSettledQuestions())
        journal.agent.interceptor(AskInTheJournal())
        journal.commands.intercept("create", OptionsOnlyInTheirButtons())
