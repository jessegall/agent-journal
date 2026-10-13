import json

from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from features.ask_questions.choices import FILED, UNPICKED, unpicked
from framework.loaded import FEATURES
from payload import AskCall
from receiving import Answerer
from resources.types import AgentRow
from serving import Providers, ReadRows


def asked_in(providers: Providers, row: AgentRow, tool: str, input: str) -> list:
    """The questions the agent put to its provider's question tool, or none when the call is not one."""
    provider = providers.offers(row.provider)
    return provider.asked_questions(AskCall.from_payload(tool, json.loads(input), {})) if provider and tool in provider.question_tools else []


def is_question_tool(providers: Providers, row: AgentRow, tool: str) -> bool:
    provider = providers.offers(row.provider)
    return bool(provider) and tool in provider.question_tools


def unnamed_pick(asked: list):
    return next((one for one in asked if unpicked(one.labels, one.pick)), None)


class AskInTheJournal(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, agents: ReadRows[AgentRow], providers: Providers) -> Answer:
        row = agents.peek_session(event.session)
        if event.subagent or not is_question_tool(providers, row, event.tool):
            return Allowed()
        missing = unnamed_pick(asked_in(providers, row, event.tool, event.input))
        return Refused(FEATURES["ask_questions"].line_text(UNPICKED, question=missing.text) if missing else FEATURES["ask_questions"].line_text(FILED))
