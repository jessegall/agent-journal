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


def test_a_search_mark_keeps_what_the_search_found_and_what_was_read_from_it_until_the_next_search_or_answer():
    from engine import bus, ran
    from engine.chat import SENT
    from features import FEATURES
    from features.history_searches.handlers import MarkHistorySearches
    from resources.base import AGENT
    features.load()
    record = fresh()
    agents = Agents(record, actor=SYSTEM)
    agent = agents.by_session("claude-1")
    search = lambda command, output: (
        MarkHistorySearches().intercept(AgentContext.of(FEATURES["history_searches"], record, agent), BashCall("Bash", {"command": command}, {}, command=command)),
        ran.announce(record, agent.n, "Bash", command, output))
    search('journal search "phone link"', "todo 12 phone link\nfact 3 tunnel")
    ran.announce(record, agent.n, "Bash", "journal todo show 12", "Title: phone link")
    ran.announce(record, agent.n, "Read", "reading a.py /x/a.py", "print(1)")
    ran.announce(record, agent.n, "Bash", "ls", "a.py")
    search('journal search "tunnel"', "fact 3 tunnel")
    ran.announce(record, agent.n, "Bash", "journal fact show 3", "The tunnel needs TLS")
    bus.announce(record, "agent", agent.n, SENT, AGENT, {"text": "done", "turn": "1"})
    ran.announce(record, agent.n, "Bash", "journal todo show 13", "after the answer")
    first, second = agents.load(agent.n).data["cards"]
    assert (first["found"], first["reads"]) == ("todo 12 phone link\nfact 3 tunnel", [{"label": "Opened todo 12", "text": "Title: phone link"}, {"label": "Read /x/a.py", "text": "print(1)"}])
    assert (second["found"], second["reads"]) == ("fact 3 tunnel", [{"label": "Opened fact 3", "text": "The tunnel needs TLS"}]), "a read after the answer belongs to no search"


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


def test_the_conversation_a_summary_replaced_and_your_own_words_are_read_back(capsys):
    import json
    from datetime import datetime, timezone
    from commands.cli import run
    from tests.kit import report
    features.load()
    record = fresh()
    stamp = datetime.now(timezone.utc).isoformat()
    rows = [{"type": "user", "timestamp": stamp, "message": {"content": "make the tunnel restart itself"}},
            {"type": "assistant", "timestamp": stamp, "message": {"content": [{"type": "text", "text": "On it, the watchdog first."}]}},
            {"type": "user", "timestamp": stamp, "isCompactSummary": True, "message": {"content": "summary of the tunnel work"}},
            {"type": "user", "timestamp": stamp, "message": {"content": "now the phone dialog"}}]
    transcript = record.root.parent / "claude-1.jsonl"
    transcript.write_text("".join(json.dumps(row) + "\n" for row in rows))
    report(record, "working", "PreToolUse", provider="claude", transcript=str(transcript))
    read = lambda *words: (run(["--root", str(record.root), "--env", record.env, "--session", "claude-1", *words]), capsys.readouterr().out)[1]
    back = read("conversation", "--back", "1")
    assert "make the tunnel restart itself" in back and "On it, the watchdog first." in back and "now the phone dialog" not in back, \
        "the conversation a summary replaced is read back, and nothing after it"
    own = read("user")
    assert "make the tunnel restart itself" in own and "now the phone dialog" in own and "watchdog" not in own, "your own words are read back, and only yours"
    assert "make the tunnel restart itself" in read("search", "restart itself"), "a search finds words in any conversation of the environment"
