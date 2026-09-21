
from controllers.types import Docs, Facts, Rules, Todos, Works
from engine.queries import carry, start_block, status
from engine.hooks import handle
from providers import PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh
from controllers.types import Works
from features.start.feature import COMPACTED
from engine.hooks import handle, start_file
from resources.base import AGENT


def test_the_start_block_names_the_environment_rules_pins_work_docs_and_todos():
    record = fresh()
    f = record.root / "runtime" / f"start-{record.env}.md"
    Rules(record, actor=USER).create("name the model on every dispatch")
    Facts(record, actor=AGENT).create("v2 imports nothing old")
    Works(record, actor=AGENT).create("the header")
    Docs(record, actor=AGENT).create("The engine", abstract="the loop from A to Z")
    Todos(record, actor=USER).create("later")
    block = f.read_text()
    assert block == start_block(record), "every write rewrites the start block"
    assert [line for line in block.splitlines() if line and not line.startswith("  ")] == \
        ["THE JOURNAL IS IN FORCE HERE — this session is bound to environment `t`.", "LAWS THE JOURNAL SHIPS, always in force:",
         "STILL OPEN, from this or an earlier session (1):", "RULES, in force on every environment (1):", "FACTS about this environment (1):",
         "DOCS catalogued — read one before you re-investigate what it settles (1):", "1 TO-DOS waiting — delayed work, not an instruction to start any of it."], \
        "it says the environment, the rules, the pins, the open work, the docs and the count of to-dos"
    assert "    1  The engine  (the loop from A to Z)" in block, "a doc line carries its abstract"

    provider = PROVIDERS["claude"]()
    out = handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1"})
    assert (out["hookSpecificOutput"]["additionalContext"] == f.read_text() and out["hookSpecificOutput"]["hookEventName"]) == "SessionStart", \
        "SessionStart returns the file as context"
    assert handle(provider, record.root, record.env, {"hook_event_name": "Stop", "session_id": "s-1"}) == {}, \
        "other events hand nothing over"

    assert status(record).splitlines()[0] == "JOURNAL  environment t", "status counts what stands, by type"
    assert (carry(record).startswith(start_block(record)) and "RULE 1  name the model" in carry(record)) is True, \
        "carry is the block and every standing thing in full"


def test_a_compacted_start_hands_the_recovery_steps_before_the_same_block():
    record = fresh()
    Works(record, actor=AGENT).create("the header")
    plain = start_file(record.root, record.env).read_text()
    compacted = start_file(record.root, record.env, compacted=True).read_text()
    assert compacted == COMPACTED + plain, "every write also rewrites the compacted block, the recovery steps before the same block"
    assert all(w in COMPACTED for w in ("conversation --back=1", "journal user", "journal open", "journal search", "Skill: journal")) is True, \
        "the steps name the reads that recover what the summary dropped"

    provider = PROVIDERS["claude"]()

    def start(source):
        return handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": source})["hookSpecificOutput"]["additionalContext"]

    assert start("startup") == plain, "a fresh start is handed the plain block"
    assert start("compact") == compacted, "a start after a compaction is handed the recovery steps first"
    assert start("resume") == plain, "a resume is a fresh start"


def test_a_new_session_is_greeted_in_its_terminal_even_before_its_engine_starts():
    import time
    from types import SimpleNamespace
    from controllers.types import Agents
    from engine.engine import Engine
    from providers import DRIVERS
    record = fresh()
    agents = Agents(record, actor="system")
    agents.update(agents.by_session("claude-1").n, event="SessionStart", status="idle")
    agents.update(agents.by_session("claude-1").n, event="SessionStart", status="idle", uses=0)
    time.sleep(0.01)
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(title="claude-1", at=time.time())
    typed = []
    engine.agent.driver.send = lambda text="", terminal=False, **rest: typed.append((text, terminal)) or True
    engine.deliver()
    assert [t for t in typed if t[0]] == [(f"the journal is ready on {record.env} — say hello in the chat, so the journal's messages reach you", True)], \
        "the greeting is typed into the terminal at once, never marked read as history"


def test_a_restarted_engine_knows_its_session_before_the_agent_acts_again():
    import time
    from controllers.types import Agents
    from engine.sessions import Sessions
    from providers import DRIVERS
    record = fresh()
    agents = Agents(record, actor="system")
    agents.update(agents.by_session("claude-1").n, provider="claude", event="Stop", inbox="/tmp/cc-socks/777.sock", at=time.time() - 600)
    Sessions(record.root).bind("claude-777", record.env, pid=777, provider="claude")
    assert DRIVERS["claude"](record, "claude-777")._report().title == "claude-1", "found by its process, not by a hook after the restart"


def test_the_channel_passes_on_the_first_line_of_a_queue_it_saw_created(tmp_path):
    import json
    from channel import contents, fresh_lines, start
    f = tmp_path / "channel.jsonl"
    at = start(f)
    f.write_text(json.dumps({"content": "your last message has no tag"}) + "\n")
    assert contents(fresh_lines(f, at)[0]) == ["your last message has no tag"], "the first line written after the channel started is sent"


def test_a_line_goes_out_at_once_and_only_one_inside_the_window_waits():
    from providers import DRIVERS
    record = fresh()
    driver = DRIVERS["claude"](record, "claude-99")
    sent = []
    driver._deliver = lambda line: sent.append(line) or True
    driver.send("first")
    driver.send("second")
    assert (sent, driver.held) == (["first"], ["second"]), "nothing queued: sent at once; inside the five seconds: queued"
    driver.sent_at -= 5
    driver.pump()
    assert sent == ["first", "second"], "the queue goes out when the window ends"


def test_enter_is_pressed_again_until_the_agent_takes_the_line(monkeypatch):
    import time
    from types import SimpleNamespace
    import engine.drivers as drivers
    from providers import DRIVERS
    monkeypatch.setattr(drivers, "ENTER_AFTER", 0)
    monkeypatch.setattr(drivers, "RECHECK", 0)
    driver = DRIVERS["claude"](fresh(), "claude-99")
    written = []
    driver._wrote = lambda raw: written.append(raw) or True
    driver._report = lambda: SimpleNamespace(at=time.time()) if written.count(b"\r") >= 2 else None
    assert (driver._type_in("hello"), written.count(b"\r")) == (True, 2), "the first Enter was swallowed: pressed again, then the hook says it was taken"
