import pytest

from controllers.types import Docs, Facts, Rules, Todos, Works
from features.session_briefing.start import QUIET, carry, start_block, status
from runner.hooks import handle
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh
from features.session_briefing.block import COMPACTED
from engine.gates import start_file


def test_the_start_block_names_the_environment_rules_pins_work_docs_and_todos():
    record = fresh()
    f = record.root / "runtime" / f"start-{record.env}.md"
    record.set_setting("form_of_address", {"first_name": "Ada"})
    Rules(record, actor=USER).create("name the model on every dispatch", keywords="word")
    Facts(record, actor=AGENT).create("v2 imports nothing old", keywords="word")
    Works(record, actor=AGENT).create("the header")
    Docs(record, actor=AGENT).create("The engine", abstract="the loop from A to Z")
    Todos(record, actor=USER).create("later")
    block = f.read_text()
    assert block == start_block(record), "every write rewrites the start block"
    f.write_text("as it was")
    Works(record, actor=AGENT).section(Works(record, actor=AGENT).rows.standing()[0].n, "Log", "a long entry the block never shows")
    assert f.read_text() == "as it was", "a work log entry leaves the start block alone: a section never shows in it"
    from engine import bus
    import threading
    import time
    ran = []
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(bus, "BACKGROUND", True)
        gate = threading.Event()
        bus.background("held", lambda: (gate.wait(2), ran.append("first")))
        bus.background("held", lambda: ran.append("second"))
        asked_at = time.monotonic()
        assert ran == [] and time.monotonic() - asked_at < 0.5, "work nobody waits for is handed to a thread of its own, and the request that asked for it goes on"
        gate.set()
        until = time.monotonic() + 3
        while len(ran) < 2 and time.monotonic() < until:
            time.sleep(0.02)
    assert ran == ["first", "second"] or ran == ["second"] or ran[-1] == "second", "and a job asked for again under the same key is run once, the newest"
    f.write_text(block)
    assert [line for line in block.splitlines() if line and not line.startswith("  ")] == \
        ["THE JOURNAL IS IN FORCE HERE — this session is bound to environment `t`.", QUIET,
         start_block(record).splitlines()[4], "LAWS THE JOURNAL SHIPS, always in force:",
         "STILL OPEN, from this or an earlier session (1):", "RULES, in force on every environment (1):", "FACTS about this environment (1):",
         "1 docs in the project; none is listed here, so look one up when a question needs it: journal doc search <term>, journal doc all.",
         "1 TO-DOS ready to take — delayed work, not an instruction to start any of it."], \
        "it says the environment, the rules, the pins, the open work, how to find the docs and the count of to-dos"
    assert "The engine" not in block, "no doc is listed, so an old one cannot put the agent on the wrong track"
    record.set_setting("form_of_address", {"title": "Madam", "first_name": "Ada"})
    assert '"Sir Ada"' in block and '"Madam Ada"' in start_block(record), "the agent calls the user by the title they chose, with their name"

    provider = PROVIDERS["claude"]()
    out = handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1"})
    assert (out["hookSpecificOutput"]["additionalContext"] == f.read_text() and out["hookSpecificOutput"]["hookEventName"]) == "SessionStart", \
        "SessionStart returns the file as context"
    assert handle(provider, record.root, record.env, {"hook_event_name": "Stop", "session_id": "s-1"}) == {}, \
        "other events hand nothing over"

    assert status(record).splitlines()[0] == "JOURNAL  environment t", "status counts what stands, by type"
    assert (carry(record).startswith(start_block(record)) and "RULE 1  name the model" in carry(record)) is True, \
        "carry is the block and every standing thing in full"
    todos = Todos(record, actor=SYSTEM)
    todos.update(todos.create("in hand").n, status="started")
    todos.create("handed over", whom="s-9")
    todos.task("helper:1", "a helper's own step")
    blocked = todos.create("blocked on something outside")
    todos.block(blocked.n, "the thing it waits for")
    waiting_on_another = todos.create("waits on another row")
    todos.after(waiting_on_another.n, blocked.n)
    assert "1 TO-DOS ready to take" in start_block(record), \
        "a to-do in hand, one handed to someone, a helper's own step, a blocked one and one waiting on another row are none of them ready to take"


def test_a_compacted_start_hands_the_recovery_steps_before_the_same_block():
    record = fresh()
    Works(record, actor=AGENT).create("the header")
    plain = start_file(record.root, record.env).read_text()
    compacted = start_file(record.root, record.env, compacted=True).read_text()
    assert compacted == COMPACTED + plain, "every write also rewrites the compacted block, the recovery steps before the same block"
    assert all(w in COMPACTED for w in ("message recent", "conversation --back=1","journal user", "journal open", "journal search", "Skill: journal")) is True, \
        "the steps name the reads that recover what the summary dropped"

    provider = PROVIDERS["claude"]()

    def start(source):
        answer = handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": source}) or {}
        return answer.get("hookSpecificOutput", {}).get("additionalContext", "")

    assert start("startup") == plain, "a fresh start is handed the plain block"
    assert start("compact") == compacted, "a start after a compaction is handed the recovery steps first"
    assert start("resume") == "", "a resume keeps its whole conversation, so it is handed nothing again"
    from engine import bus
    start_file(record.root, record.env).unlink()
    with bus.held():
        assert start("startup") == plain, "with the block not yet written and the bus held, as inside a request, the start writes it and hands it over"

    from engine.sessions import Seat, Sessions, live
    sessions = Sessions(record.root)
    sessions.bind("s-before", record.env, pid=1, provider="claude")
    assert sessions.holder(record.env) == "s-before", "the session that bound the environment holds it"
    assert sessions.succeed(Seat(record.env, "s-after")) == ["s-before"], "a session taking an environment retires every other session of it"
    left = sessions.read("s-before")
    assert (left.environment, bool(left.retired), live(left)) == (record.env, True, False), \
        "a retired session keeps its environment, so its transcript and its chat stay where the work happened, and stops holding it"
    assert sessions.holder(record.env) == "s-before" and sessions.last(record.env, "claude") == "", \
        "a session still running is the environment's agent, whatever succeeded it: the environment's agent is whichever of its sessions is at work, and having been someone's past only keeps it from being taken up again as a conversation to resume"
    import os
    from agents.terminal import seat_session
    sessions.bind("conversation-here", record.env, pid=os.getpid(), provider="claude")
    seat_session(sessions, Seat(record.env, "claude-here", os.getpid()), provider="claude")
    assert not sessions.read("conversation-here").retired and sessions.holder(record.env) in sessions.agent("claude-here"), \
        "an agent's terminal and its conversation are one agent, so seating one never retires the other: the terminal is seated with the process it shares, and the environment stays this agent's"
    handed = start("startup")
    assert "ANOTHER AGENT WORKED THIS ENVIRONMENT UNTIL" in handed and "written to that agent, not to you" in handed, \
        "a session that is not the first in its environment is told what it took over, so it reads the chat above as history rather than as instructions to itself"


def test_a_new_session_is_greeted_in_its_terminal_even_before_its_engine_starts():
    import time
    from types import SimpleNamespace
    from controllers.types import Agents
    from runner.engine import Engine
    from providers import DRIVERS
    record = fresh()
    agents = Agents(record, actor="system")
    agents.saw(agents.by_session("claude-1").n, {"hook": "SessionStart"}, event="SessionStart", status="idle", at=time.time())
    agents.update(agents.by_session("claude-1").n, event="SessionStart", status="idle", uses=0)
    time.sleep(0.01)
    engine = Engine(record, DRIVERS["claude"](record, "claude-99"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(n=agents.by_session("claude-1").n, title="claude-1", at=time.time(), asking={}, status="working")
    sent = []
    engine.agent.driver.send = lambda text="", **rest: sent.extend([text, rest.get("yielding", "")]) or True
    engine.deliver()
    assert any(f"the journal is ready on {record.env} — say hello in the chat in plain words, so the journal's messages reach you" in text for text in [*sent, *engine.agent.driver.held]), \
        "the greeting is a whisper, which the driver holds for the one send and never marks read as history"
    from controllers.types import Environments
    from engine.record import Record
    Environments(record, actor="system").create("ticket-5", owner="ticket:5")
    ticket = Record(record.root, "ticket-5")
    ticket_agents = Agents(ticket, actor="system")
    ticket_agents.saw(ticket_agents.by_session("claude-5").n, {"hook": "SessionStart"}, event="SessionStart", status="idle", at=time.time())
    engine = Engine(ticket, DRIVERS["claude"](ticket, "claude-98"))
    engine.agent.driver.last_report = lambda: SimpleNamespace(n=ticket_agents.by_session("claude-5").n, title="claude-5", at=time.time(), asking={}, status="working")
    quiet = []
    engine.agent.driver.send = lambda text="", **rest: quiet.append(text) or True
    engine.deliver()
    assert not [text for text in [*quiet, *engine.agent.driver.held] if "say hello" in text], "an agent working in the background, such as a ticket's, is never asked to say hello"


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


def test_a_line_goes_out_at_once_and_only_one_inside_the_window_waits_and_a_follow_up_is_typed_as_an_instruction(monkeypatch):
    from providers import DRIVERS
    record = fresh()
    driver = DRIVERS["claude"](record, "claude-99")
    sent = []
    driver._deliver = lambda line, by: sent.append(line) or True
    driver.send("first")
    driver.send("second")
    assert (sent, driver.held) == (["first"], ["second"]), "nothing queued: sent at once; inside the five seconds: queued"
    driver.sent_at -= 5
    driver.pump()
    assert sent == ["first", "second"], "the queue goes out when the window ends"
    follow = DRIVERS["claude"](fresh(), "claude-9")
    typed = []
    monkeypatch.setattr(follow, "_typed", lambda line, confirmed: typed.append(line) or True)
    monkeypatch.setattr(follow, "awaits_answer", lambda: False)
    assert follow.send("do the next step", now=True, by="claude-1")
    from payload import said_by
    assert typed == [f"{said_by('claude-1')}\ndo the next step"], \
        "a follow-up is typed as an instruction and says which agent it comes from, so the agent reading it can tell"
    assert follow.send("todo 5 next", now=True)
    assert typed[-1] == "[journal] todo 5 next", "and the journal's own line is typed too: there is no second road"
    import time
    twice = DRIVERS["claude"](fresh(), "claude-8")
    typing = []
    monkeypatch.setattr(twice, "_typed", lambda line, confirmed: typing.append(line) or setattr(twice, "entered_at", time.time()) or False)
    monkeypatch.setattr(twice, "awaits_answer", lambda: False)
    assert [twice.send("1 new message 7", now=True), twice.send("1 new message 7", now=True)] == [False, True]
    assert typing == ["[journal] 1 new message 7"], \
        "a line typed whose landing was not confirmed is not typed again a moment later: the agent has it once"


def test_enter_is_pressed_again_until_the_agent_takes_the_line(monkeypatch):
    import time
    from types import SimpleNamespace
    import providers.drivers as drivers
    from providers import DRIVERS
    monkeypatch.setattr(drivers, "ENTER_AFTER", 0)
    monkeypatch.setattr(drivers, "RECHECK", 0)
    driver = DRIVERS["claude"](fresh(), "claude-99")
    written = []
    driver._wrote = lambda raw: written.append(raw) or True
    driver._report = lambda: SimpleNamespace(at=time.time(), asking={}, status="idle") if written.count(b"\r") >= 2 else None
    assert (driver.send("hello", now=True), written.count(b"\r")) == (True, 2), "the first Enter was swallowed: pressed again, then the hook says it was taken"
    assert b"[journal] hello" in written, "a typed line says it is the journal's, so the agent never takes it for the user"


def test_a_model_switch_is_confirmed_when_claude_asks(monkeypatch):
    import providers.claude_driver as claude
    from engine import runtime
    from providers import DRIVERS
    record = fresh()
    driver = DRIVERS["claude"](record, "claude-1")
    screen = runtime.session_file(record.root, "claude-1", "screen")
    screen.parent.mkdir(parents=True, exist_ok=True)
    screen.write_bytes(b"Enter to confirm, from an older prompt\r\n")
    monkeypatch.setattr(claude, "CONFIRM_POLL", 0.01)
    monkeypatch.setattr(claude, "CONFIRM_WAIT", 0.2)
    monkeypatch.setattr("providers.drivers.ENTER_AFTER", 0)
    monkeypatch.setattr("providers.drivers.ECHO_WAIT", 0)
    sent = []

    def answering(redraw):
        def typed(raw):
            sent.append(raw)
            if raw.startswith(b"/model"):
                screen.write_bytes(redraw(screen.read_bytes()))
            return True
        return typed

    switched = lambda: driver.run_command("/model sonnet") and sent.count(b"\r") == 2
    driver._wrote, driver.clear_input = answering(lambda before: before + b"\x1b[1mSwitch to Sonnet?\x1b[0m\r\n Enter to confirm \xc2\xb7 Esc to cancel"), lambda: None
    assert switched(), "the switch is typed and Claude's confirmation is answered with Enter"
    sent.clear()
    driver.run_command("/effort high")
    assert sent.count(b"\r") == 1, "a command that asks nothing gets no second Enter, even with an old prompt on screen"
    sent.clear()
    screen.write_bytes(b"")
    driver._wrote = answering(lambda before: b"Switch model?\r\n Your next response will be slower and use more tokens\r\n \xe2\x9d\xaf 1. Yes, switch to Sonnet 5.5\r\n   2. No, go back")
    assert switched(), "Claude's Switch model? question is answered with Enter, which takes Yes"


def test_a_typed_line_left_in_the_input_box_is_sent_again(monkeypatch):
    import providers.drivers
    from engine import runtime
    from providers import DRIVERS
    monkeypatch.setattr(providers.drivers, "ENTER_AFTER", 0)
    monkeypatch.setattr(providers.drivers, "RECHECK", 0)
    monkeypatch.setattr(providers.drivers, "ECHO_WAIT", 0)
    record = fresh()
    driver = DRIVERS["claude"](record, "claude-7")
    screen = runtime.session_file(record.root, "claude-7", "screen")
    screen.parent.mkdir(parents=True, exist_ok=True)
    screen.write_bytes("❯ [journal] the plan waits\n".encode())
    pressed = []

    def wrote(raw):
        pressed.append(raw)
        if raw == b"\r" and len([key for key in pressed if key == b"\r"]) >= 2:
            screen.write_bytes("❯ [journal] the plan waits\n  thinking\n❯ \n".encode())
        return True
    monkeypatch.setattr(driver, "_wrote", wrote)
    monkeypatch.setattr(driver, "clear_input", lambda: None)
    monkeypatch.setattr(driver, "_submitted", lambda since: True)
    assert driver.send("the plan waits", now=True) and pressed.count(b"\r") == 2, "Enter is pressed again while the line still sits in the input box"
    pressed.clear()
    screen.write_bytes("❯ [journal] stuck for good\n".encode())
    monkeypatch.setattr(driver, "_wrote", lambda raw: pressed.append(raw) or True)
    assert not driver.send("stuck for good", now=True) and pressed.count(b"\r") == 1 + providers.drivers.RESUBMITS, \
        "a line that never leaves the input box is pressed a few times at most and reported as not sent"
    import json
    from datetime import datetime, timezone
    from types import SimpleNamespace
    pressed.clear()
    note = "You're restarted: ticket 8 merged, carry on with the parity run"
    screen.write_bytes(f"❯ {note}\n".encode())
    transcript = record.root / "t.jsonl"
    transcript.write_text(json.dumps({"type": "user", "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "message": {"content": note}}) + "\n")
    monkeypatch.setattr(driver, "last_report", lambda: SimpleNamespace(transcript=str(transcript), asking={}, status="working"))
    assert driver.send(note, now=True, by="ticket-8") and pressed.count(b"\r") == 1, \
        "a note already in the agent's transcript has landed, though a freshly started agent's screen still shows it last"
    pressed.clear()
    screen.write_bytes("❯ [Pasted text #1 +2 lines]\n".encode())
    monkeypatch.setattr(providers.drivers, "TYPED_PER_SECOND", 10 ** 9)
    assert driver.send("a long review note " * 30, now=True, by="ticket-8") and pressed[0].startswith(providers.drivers.PASTE_START) and pressed.count(b"\r") == 1, \
        "a long line goes in as one paste and is sent once: a busy agent keeps a queued paste's placeholder in view, which is no sign it is stuck"
    claude = DRIVERS["claude"](record, "claude-8")
    monkeypatch.setattr(claude, "last_printed", lambda: "done\n❯ ")
    assert claude.at_prompt(), "the silence probe still reads Claude's prompt: the input-box mark never replaces the prompt pattern"
    codex = DRIVERS["codex"](record, "codex-9")
    monkeypatch.setattr(codex, "_wrote", lambda raw: True)
    monkeypatch.setattr(codex, "clear_input", lambda: None)
    assert codex.run_command("/status"), "a driver without an input-box mark types a command and returns at once"
    pressed.clear()
    monkeypatch.setattr(codex, "_wrote", lambda raw: pressed.append(raw) or True)
    monkeypatch.setattr(codex, "_submitted", lambda since: pressed.count(b"\r") >= 2)
    assert codex.send("deploy it", now=True, by="ticket-8") and pressed.count(b"\r") == 2, \
        "an Enter Codex read as a new line is pressed again until Codex takes the message"
