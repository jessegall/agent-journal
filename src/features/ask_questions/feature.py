from controllers.types import Questions
from features.base import Feature
from features.triggers.watched import FACTS, state_facts
from resources.base import SYSTEM
from features.journal import Journal
from features.ask_questions.answers import answers_added
from features.ask_questions.details import AskQuestionsDetails
from features.ask_questions.handlers import AnswerOnTheScreen, AskInsteadOfProse, DismissSettledQuestions, MarkTheAnswer, ReleaseOnceAnswered, ReleaseOnceAsked, open_a_day
from features.sending import Nudge
from features.ask_questions.interceptors import AskedOnce, AskInTheJournal, AskOnItsOwn, NamesItsPick, OneAskPerRow, OptionsOnlyInTheirButtons, OptionsWhenEnumerable


class AskQuestions(Feature):
    details = AskQuestionsDetails
    nudges = (Nudge("settled", behaviour="settled", about=open_a_day,
                    guarantee="When a question has waited a day for an answer, the agent is told, so a question is not left hanging for ever."),)

    def register(self, journal: Journal) -> None:
        FACTS.register(self, *state_facts("question", "open", lambda context: [q for q in Questions(context.record, actor=SYSTEM).rows.standing() if not q.hidden]))
        journal.events.handler(AskInsteadOfProse())
        journal.events.handler(ReleaseOnceAsked())
        journal.events.handler(ReleaseOnceAnswered())
        journal.events.handler(MarkTheAnswer())
        journal.events.handler(AnswerOnTheScreen())
        journal.events.handler(DismissSettledQuestions())
        journal.agent.append_to_line("question.completed", answers_added)
        journal.agent.interceptor(AskInTheJournal())
        journal.agent.interceptor(AskOnItsOwn())
        journal.commands.intercept("create", OptionsOnlyInTheirButtons())
        journal.commands.intercept("create", NamesItsPick())
        journal.commands.intercept("create", AskedOnce())
        journal.commands.intercept("create", OneAskPerRow())
        journal.commands.intercept("create", OptionsWhenEnumerable())
