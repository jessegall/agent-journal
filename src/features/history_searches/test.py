import features
from controllers.types import Agents
from features.parts import AgentContext
from providers.payload import BashCall
from resources.base import SYSTEM
from tests.conftest import fresh


def test_a_search_of_the_history_is_marked_in_the_chat_and_other_commands_are_not():
    from features import FEATURES
    from features.history_searches.handlers import MarkHistorySearches
    features.load()
    record = fresh()
    agent = Agents(record, actor=SYSTEM).by_session("claude-1")
    run = lambda command: MarkHistorySearches().intercept(AgentContext.of(FEATURES["history_searches"], record, agent),
                                                          BashCall("Bash", {"command": command}, {}, command=command))
    for command in ('cd x && journal search "phone link" 2>&1 | head -5', "journal --env main conversation --back=1", "journal user | tail",
                    "journal todo all", "grep journal search.py"):
        assert run(command) == "", "a mark never holds the call"
    marks = [card["label"] for card in Agents(record, actor=SYSTEM).load(agent.n).data.get("cards") or []]
    assert marks == ["Searched the history for 'phone link'", "Read back the conversation the last summary replaced", "Read back your own words"], marks
