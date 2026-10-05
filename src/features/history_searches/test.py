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


def test_a_transcript_rewritten_in_place_is_read_again_not_served_from_the_cache(tmp_path):
    import json
    from providers import PROVIDERS
    from providers.transcript_cache import SHAPED_BY, code_mark
    claude = PROVIDERS["claude"]()
    entry = lambda text: json.dumps({"type": "user", "timestamp": "2026-10-05T10:00:00Z", "message": {"content": text}}) + "\n"
    transcript = tmp_path / "s-1.jsonl"
    transcript.write_text(entry("the first words") + entry("and more of them"))
    first = [turn.text for turn in claude.turns(transcript)]
    transcript.write_text(entry("a new start"))
    assert [turn.text for turn in claude.turns(transcript)] == ["a new start"] != first, "a transcript that shrank is read from its start again"
    transcript.write_text(entry("the first word!") + entry("and more of them"))
    assert [turn.text for turn in claude.turns(transcript)][0] == "the first word!", "one replaced at a size it had before is read again too"
    assert "engine.transcript" in SHAPED_BY and code_mark(), "the cache is keyed on the code that shapes a turn, so an upgrade never reads old turns"
