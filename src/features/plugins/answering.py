import re

from engine.gates import DISPATCHING, LONG_COMMAND
from events.answers import Allowed, Answer, Refused, Rewritten
from events.asking import AgentDispatching, LongCommandMoving, TextFormatting, ToolCallAsked
from framework.plugins.declared import declared
from receiving import Answerer
from resources.types import Plugin
from serving import ReadOwnWork, ReadRows

KEPT_RULES: dict[str, tuple] = {}


def chat_rules(plugins: ReadRows[Plugin]) -> list:
    """The find-and-replace rules the enabled plugins declare for the chat, kept until a plugin row changes."""
    stamp = tuple((row.n, row.stamp) for row in plugins.rows.summaries())
    kept = KEPT_RULES.get(str(plugins.record.home))
    if kept and kept[0] == stamp:
        return kept[1]
    found = [(rule.find, rule.replacement) for row in plugins.rows.standing() if row.enabled for rule in declared(row).chat]
    KEPT_RULES[str(plugins.record.home)] = (stamp, found)
    return found


class ApplyPluginChatRules(Answerer[TextFormatting]):
    def answer(self, request: TextFormatting, plugins: ReadRows[Plugin]) -> Answer:
        if plugins.record is None:
            return Allowed()
        text = request.text
        for find, becomes in chat_rules(plugins):
            text = re.sub(find, becomes, text)
        return Rewritten(text)


class AskPluginsToRefuse(Answerer[ToolCallAsked]):
    def answer(self, request: ToolCallAsked, work: ReadOwnWork) -> Answer:
        if request.subagent:
            return Allowed()
        why = work.refuse_call(request.session, request.tool, request.paths[0] if request.paths else "", request.command, request.writes)
        return Refused(why) if why else Allowed()


class AskPluginsToCancel(Answerer[AgentDispatching]):
    def answer(self, request: AgentDispatching, work: ReadOwnWork) -> Answer:
        if request.subagent:
            return Allowed()
        why = work.cancel_call(DISPATCHING, request)
        return Refused(why) if why else Allowed()


class AskPluginsToKeepLongCommand(Answerer[LongCommandMoving]):
    def answer(self, request: LongCommandMoving, work: ReadOwnWork) -> Answer:
        why = work.cancel_call(LONG_COMMAND, request)
        return Refused(why) if why else Allowed()
