import json

from events import Fact
from events.agents import AgentReported, ToolCallAnswered
from events.messages import MessageCreated
from events.questions import AnswerGiven, AnswerOnScreen, AskingSettled, ProseOffersChoices, QuestionCompleted, QuestionCreated, QuestionSettled, QuestionsToFile
from events.resources import AnyEvent
from features.ask_questions.answering import asked_in, unnamed_pick
from features.ask_questions.choices import FILED, offers_choices
from framework.loaded import FEATURES
from receiving import Listener
from resources.base import USER, Ref
from resources.types import AgentRow, Question
from serving import Providers, ReadRows, ReadSessions, Settings

ASKING = "asking"
WAITED_ON = ("todo", "plan", "ticket")
GONE = {"completed": "closed", "deleted": "deleted"}


def settled(agents: ReadRows[AgentRow]) -> list[Fact]:
    agent = agents.primary_to_read()
    return [AskingSettled(agent=agent.n)] if agent else []


class SpotProse(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], providers: Providers, settings: Settings) -> list[Fact]:
        offered = settings.is_on(ASKING) and offers_choices(providers.last_said(agents.peek(event.agent)))
        return [ProseOffersChoices(agent=event.agent)] if offered else []


class SpotQuestionAsked(Listener[QuestionCreated]):
    def listen(self, event: QuestionCreated, agents: ReadRows[AgentRow]) -> list[Fact]:
        return settled(agents)


class SpotUserWrote(Listener[MessageCreated]):
    def listen(self, event: MessageCreated, agents: ReadRows[AgentRow]) -> list[Fact]:
        return settled(agents) if event.actor == USER else []


class SpotAnswer(Listener[QuestionCompleted]):
    def listen(self, event: QuestionCompleted, questions: ReadRows[Question], agents: ReadRows[AgentRow], sessions: ReadSessions) -> list[Fact]:
        question, agent = questions.load(event.n), agents.primary_to_read()
        if event.actor != USER or question.hidden or not agent or sessions.asking(question.n):
            return []
        return [AnswerGiven(agent=agent.n, n=question.n, answer=question.outcome, ref=question.ref)]


class SpotAnswerOnScreen(Listener[QuestionCompleted]):
    def listen(self, event: QuestionCompleted, questions: ReadRows[Question], agents: ReadRows[AgentRow], sessions: ReadSessions) -> list[Fact]:
        question, agent = questions.load(event.n), agents.primary_to_read()
        if not agent or not question.completed or sessions.asking(question.n):
            return []
        return [AnswerOnScreen(agent=agent.n, option=int(question.chosen), text=question.outcome, options=len(question.options))]


class SpotSettledRows(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, questions: ReadRows[Question]) -> list[Fact]:
        if event.type not in WAITED_ON or event.action not in GONE:
            return []
        ref = Ref(event.type, event.n)
        return [QuestionSettled(n=q.n, why=f"{ref.spoken}, which it was about, is {GONE[event.action]}") for q in questions.rows.standing() if str(ref) in q.refs]


class SpotQuestionToolRefused(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, agents: ReadRows[AgentRow], providers: Providers) -> list[Fact]:
        if event.subagent or event.why != FEATURES["ask_questions"].line_text(FILED):
            return []
        asked = asked_in(providers, agents.peek(event.agent), event.tool, event.input)
        if unnamed_pick(asked):
            return []
        return [QuestionsToFile(agent=event.agent, asked=json.dumps([{"text": one.text, "options": one.options, "pick": one.pick} for one in asked]))]
