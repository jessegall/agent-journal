import json
import re
import shlex

from events import Fact
from events.questions import AnswerGiven, AnswerOnScreen, AskingSettled, ProseOffersChoices, QuestionSettled, QuestionsToFile
from features.ask_questions.listeners import ASKING
from receiving import Handler
from resources.base import SYSTEM, USER, titled
from resources.types import AgentRow, Question
from serving import Chat, Commands, Rows, Terminal


class AskInsteadOfProse(Handler[ProseOffersChoices]):
    def handle(self, event: ProseOffersChoices, chat: Chat) -> list[Fact]:
        chat.say("prose")
        chat.hold("prose held", ASKING)
        return []


class ReleaseOnceSettled(Handler[AskingSettled]):
    def handle(self, event: AskingSettled, chat: Chat) -> list[Fact]:
        chat.release(ASKING)
        return []


class MarkTheAnswer(Handler[AnswerGiven]):
    def handle(self, event: AnswerGiven, agents: Rows[AgentRow], chat: Chat) -> list[Fact]:
        agents.card(event.agent, label=f"You answered question {event.n}", icon="question", color="var(--blocking)", side=USER, row=event.ref)
        chat.say("answered", n=event.n, answer=event.answer, rows=[event.ref])
        return []


class AnswerOnTheScreen(Handler[AnswerOnScreen]):
    def handle(self, event: AnswerOnScreen, terminal: Terminal) -> list[Fact]:
        terminal.answer_prompt(event.answer)
        return []


class DismissSettledQuestion(Handler[QuestionSettled]):
    def handle(self, event: QuestionSettled, questions: Rows[Question]) -> list[Fact]:
        questions.dismiss(event.n, why=event.why)
        return []


class FileQuestions(Handler[QuestionsToFile]):
    def handle(self, event: QuestionsToFile, commands: Commands, chat: Chat) -> list[Fact]:
        filed = [commands.run(ask(one)) for one in json.loads(event.asked)]
        chat.nudge("filed as", numbers=", ".join(number.group() for ran in filed if (number := re.search(r"\d+", ran.output))) or "none")
        return []


def ask(one: dict) -> str:
    pick = f" --set pick={one['pick']}" if one["pick"] else ""
    return f"question ask {shlex.quote(titled(one['text']))} --brief {shlex.quote(one['text'])} --set options={shlex.quote(json.dumps(one['options']))}{pick}"
