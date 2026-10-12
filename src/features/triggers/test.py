import features
import pytest
from controllers.types import Agents, Messages
from controllers.triggers.controller import Triggers
from payload import BashCall
from tests.conftest import fresh
from tests.kit import nudges, report


def call(command: str) -> BashCall:
    return BashCall("Bash", {"command": command}, {}, command=command)


def fired(record, command: str) -> str:
    from framework.loaded import FEATURES
    from framework.parts import AgentContext
    from features.triggers.handlers import DenyWhatTheAgentDoes, WatchWhatTheAgentDoes
    context = AgentContext.of(FEATURES["triggers"], record, Agents(record, actor="system").by_session("claude-1"))
    denied = DenyWhatTheAgentDoes().intercept(context, call(command))
    WatchWhatTheAgentDoes().intercept(context, call(command))
    return denied


def test_a_trigger_denies_a_command_and_nudges_on_a_word():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("no force pushes", text="force pushing rewrites the shared history",
                                          **{"words": ["--force"], "does": "deny", "words_in": "commands"})
    Triggers(record, actor="user").create("mind the migrations", text="run the migration test after touching them",
                                          **{"words": ["migration"], "does": "nudge"})
    from declaring.holds import Runs
    from features.triggers.handlers import DenyWhatTheAgentDoes, WatchWhatTheAgentDoes
    assert (DenyWhatTheAgentDoes.runs, WatchWhatTheAgentDoes.runs) == (Runs.SYNC, Runs.ASYNC), \
        "a deny decides the call before it is answered; a nudge or an instruction is said after the answer"
    assert "no force pushes" in fired(record, "git push --force origin main"), "a deny refuses the call with its reason"
    assert fired(record, "grep migration engine") == "", "a nudge lets the call through"
    assert [n for n in nudges(record) if "mind the migrations" in n], "and says its line to the agent"
    cards = [(card["label"], card["tone"]) for card in Agents(record, actor="system").by_session("claude-1").data["cards"]]
    assert cards == [("Trigger no force pushes denied the call", "danger"), ("Trigger mind the migrations nudged the agent", "note")], \
        "each firing is marked in the chat with what it did, a deny in the danger tone"
    Triggers(record, actor="user").create("bump the version", text="update VERSION and the changelog before tagging",
                                          **{"words": ["tag"], "does": "instruct", "words_in": "commands"})
    assert fired(record, "git tag v2.252.0") == "", "an instruction lets the call through"
    assert [n for n in nudges(record) if "bump the version" in n], "and puts its instruction in front of the agent"
    assert Agents(record, actor="system").by_session("claude-1").data["cards"][-1]["label"] == "Trigger bump the version instructed the agent", \
        "its mark says it instructed the agent"


def test_a_trigger_fires_on_what_the_user_writes():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("ship it", text="run the suite before the release", **{"words": ["release"]})
    Messages(record, actor="user").create("time for a release")
    assert [n for n in nudges(record) if "ship it" in n], "the user's own words fire it too"


def test_a_trigger_message_does_not_fire_the_trigger_again():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("release reminder", brief="release checklist", **{"words": ["release"], "does": "message"})
    Messages(record, actor="user").create("release time")
    messages = Messages(record, actor="system").rows.every()
    assert len(messages) == 2
    assert messages[-1].data["trigger"] == 1


def test_a_trigger_fires_on_what_the_agent_says_in_the_chat():
    from payload import Chunk
    from runner.chat_mirror import displayed
    from engine.sessions import Sessions
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse", provider="claude")
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    Triggers(record, actor="user").create("no greeting", text="the test word is denied", **{"words": ["hello"], "does": "deny", "words_in": "text"})
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", "index": 0, "final": True, "delta": "Hello! Ready."}))
    cards = [(card["label"], card["tone"]) for card in Agents(record, actor="system").by_session("claude-1").data["cards"]]
    assert (cards, [n for n in nudges(record) if "no greeting" in n] != []) == ([("Trigger no greeting caught a denied word in the agent's message", "danger")], True), \
        "a denied word in the agent's own chat is marked and the agent is told"


def test_deleting_a_trigger_sets_the_sequences_it_starts_back_to_by_hand():
    from features.sequences.controller import Sequences
    record = fresh()
    triggers = Triggers(record, actor="system")
    sequences = Sequences(record, actor="system")
    trigger = triggers.create("release", **{"words": ["release"], "does": "start"})
    made = sequences.create("Release checklist", starts_on=f"trigger:{trigger.n}")
    triggers.delete(trigger.n)
    assert sequences.load(made.n).data["starts_on"] == "", "a sequence never points at a trigger that is gone"


def test_a_trigger_made_from_the_command_line_carries_its_summary_and_counts_its_matches():
    record = fresh()
    triggers = Triggers(record, actor="system")
    row = triggers.create("no force push", **{"words": ["push --force"], "does": "deny", "words_in": "commands", "text": "Never force-push."})
    assert triggers.load(row.n).brief == "When the agent runs a command with “push --force”, block it and tell the agent “Never force-push.”", \
        "the brief is the sentence the viewer shows"
    triggers.fired(row.n)
    triggers.fired(row.n)
    assert (triggers.load(row.n).matched, bool(triggers.load(row.n).matched_at)) == (2, True), "each match is counted and dated"
    from controllers.triggers.summary import EMPTY, summary, words_text
    assert [words_text(words) for words in (["a"], ["a", "b"], ["a", "b", "c", "d"], list("abcde"))] == \
        ["“a”", "“a” or “b”", "“a”, “b”, “c” or 1 other phrase", "“a”, “b”, “c” or 2 other phrases"], "a sentence names the first three phrases and counts the rest"
    from types import SimpleNamespace
    assert summary(SimpleNamespace(words=[], is_state=False), [], None) == EMPTY, "a trigger with no words says what it still needs"
    from tests.conftest import refused
    assert "a trigger does one of" in refused(lambda: triggers.create("odd", **{"words": ["x"], "does": "dance"})), "a trigger does one of the things a trigger can do"
    assert "needs words to watch for" in refused(lambda: triggers.update(row.n, words=[])), "a trigger emptied of its words would watch for nothing and is refused"
    triggers.watch_for("Release checklist", ["release"])
    triggers.unwatch("Release checklist", "no longer shipped")
    assert [row.title for row in triggers.rows.standing() if row.title == "Release checklist"] == [], "a sequence's own watch is taken away with it"


def test_a_part_a_feature_leaves_unwritten_refuses_until_it_is():
    import pytest
    from framework.parts import ActionInterceptor, Canceler, Command, Handler, TextFormatter, ToolInterceptor
    calls = (lambda: Handler().handle(None, None), lambda: TextFormatter().format(None, ""), lambda: ToolInterceptor().intercept(None, None),
             lambda: Canceler().cancel(None, None), lambda: Command().run(None, None), lambda: ActionInterceptor().intercept(None, None))
    for call in calls:
        with pytest.raises(NotImplementedError):
            call()


def test_a_nudge_that_offers_its_first_row_must_be_capped_and_an_undeclared_setting_is_refused():
    import pytest
    from framework.sending import Nudge, send
    from declaring.settings import Settings
    with pytest.raises(ValueError, match="needs most"):
        Nudge("line", "behaviour", lambda context, agent: [], first=True)
    with pytest.raises(AttributeError, match="no setting called nothing"):
        Settings([], {}).nothing
    from types import SimpleNamespace
    assert send(SimpleNamespace(to_primary=lambda: None), (Nudge("line", "behaviour", lambda context, agent: [1]),)) is None, \
        "with no agent to speak to, a nudge says nothing and asks nothing"
    from declaring import trigger
    from framework import actions
    own = Nudge("line", "behaviour", lambda context, agent: [], timing=trigger.Trigger(unit=trigger.MINUTES, every=1), action=actions.MESSAGE)
    assert (own.action, bool(own.timing), bool(Nudge("line", "behaviour", lambda context, agent: []).timing)) == (actions.MESSAGE, True, False), \
        "a nudge keeps its own timing and action, and has neither unless given"


def test_every_kind_of_tool_call_says_what_it_is_doing_and_which_words_a_trigger_may_read(monkeypatch):
    from providers import PROVIDERS
    from payload import call_of, response_text
    kinds = PROVIDERS["claude"].tool_kinds
    called = lambda name, given, response=None: call_of({"tool_name": name, "tool_input": given, "tool_response": response or {}}, kinds)
    web = called("WebSearch", {"query": "python typing"})
    files = called("Grep", {"pattern": "def main"})
    fetch = called("WebFetch", {"url": "https://example.com/docs/page"})
    assert (web.doing, web.words, web.subject) == ("searching the web for python typing", ("python typing",), "python typing"), "a web search says what it looks up"
    assert (files.doing, files.words, files.subject) == ("searching def main", ("def main",), "def main"), "a search of files says what it looks for"
    assert (fetch.doing, fetch.words, fetch.subject, fetch.host) == ("fetching example.com", ("https://example.com/docs/page",), "example.com", "example.com"), "a fetch names the host"
    assert called("WebFetch", {"url": "example.com"}).host == "example.com", "an address with no path is its own host"
    skill = called("Skill", {"skill": "journal"})
    assert (skill.doing, skill.words, skill.subject, skill.loaded_skill) == ("loading skill journal", ("journal",), "journal", "journal"), "a skill load names the skill"
    sent = called("mcp__figma__get_design_context", {"node": "1"})
    assert (sent.doing, sent.server_tool) == ("figma · get design context", ("figma", "get design context")), "a tool of an outside server is named with its server"
    plain = called("Frobnicate", {})
    assert (plain.doing, plain.server_tool) == ("frobnicate", None), "any other tool is named by itself"
    written = called("Write", {"file_path": "a.py", "content": "x = 1"})
    assert (written.output, written.writings) == ("", ("x = 1",)), "a write has no output and its text is what it writes"
    cron = called("CronCreate", {"cron": "* * * * *", "prompt": "check"}, {"id": "job-9"})
    other = called("CronCreate", {"cron": "* * * * *", "prompt": "check"}, {"stdout": "Scheduled loop abc12345"})
    assert cron.loop == "job-9", "a loop is known by the id its tool answered with"
    assert called("Read", {}).__class__.__name__ == "ToolUse", "a call that lacks what its kind needs is read as a plain tool use"
    assert (response_text({"file": {"content": "inside"}}), response_text({"filenames": ["a", "b"]}), response_text(7), response_text(["x", "", "y"])) == \
        ("inside", "a\nb", "", "x\ny"), "a tool's answer is read as text whatever shape it comes in"
    assert other.loop == "abc12345", "a loop id written in the answer's text is found when it is not a field"


def test_each_watched_fact_names_its_rows_only_past_its_threshold_twenty_stay_inside_the_budget_and_a_trigger_on_one_tells_or_holds(monkeypatch):
    import time as clock
    from controllers.types import Questions, Todos, Works
    from framework.loaded import FEATURES
    from framework import watched
    from framework.parts import AgentContext
    from resources.base import AGENT, SYSTEM, USER
    from tests.kit import idle

    def finding(record, name: str, over: float) -> list[str]:
        context = AgentContext.of(FEATURES["triggers"], record, Agents(record, actor=SYSTEM).by_session("claude-1"))
        return [found.key for found in watched.found(watched.Watched.parse(name, over), context, context.agent.row)]

    record = fresh()
    idle(record, context=70)
    Messages(record, actor=USER).create("answer me")
    Questions(record, actor=AGENT).create("Which one?", options=[{"title": "A"}, {"title": "B"}], pick=1)
    work = Works(record, actor=AGENT).create("the job")
    Works(record, actor=AGENT).section(work.n, "log", "started")
    now = clock.time()
    monkeypatch.setattr(clock, "time", lambda: now + 20 * 60)
    assert (finding(record, "message.unread.created", 10), finding(record, "message.unread.created", 30)) == (["1"], []), "an unread message is named once it is older than the threshold"
    assert (finding(record, "question.open.created", 10), finding(record, "question.open.created", 30)) == (["1"], []), "an open question is named once it is older than the threshold"
    assert (finding(record, "work.open.logged", 10), finding(record, "work.open.logged", 30)) == ([str(work.n)], []), "work is unlogged from its last entry, not from its start"
    assert (finding(record, "agent.context", 60), finding(record, "agent.context", 80)) == (["claude-1"], []), "the context is named above the percent"
    assert (finding(record, "agent.idle", 10), finding(record, "agent.idle", 30)) == (["claude-1"], []), "an idle agent is named once it has been idle long enough"
    def took(name: str) -> float:
        started = clock.perf_counter()
        for _ in range(5):
            finding(record, name, 10)
        return (clock.perf_counter() - started) / 5

    slowest = max(watched.FACTS.each(record), key=lambda fact: took(fact.name))
    assert took(slowest.name) < 0.005, f"each fact on its own is read in a tenth of the fifty millisecond hook budget, however many facts there are; {slowest.name} was not"
    for n in range(50):
        Messages(record, actor=USER).create(f"waiting {n}")
    monkeypatch.setattr(clock, "time", lambda: now + 40 * 60)
    assert finding(record, "message.unread.created", 10) == [str(n) for n in range(1, watched.MOST_NAMED + 1)], \
        "a fact over many rows names at most its budget of them in one reading, the oldest first"
    monkeypatch.setattr(clock, "time", lambda: now + 20 * 60)
    Messages(record, actor=AGENT).read_all(list(range(2, 52)))
    context = AgentContext.of(FEATURES["triggers"], record, Agents(record, actor=SYSTEM).by_session("claude-1"), hook=object())
    counted = []
    counting = watched.Fact("agent.idle", watched.MINUTES, "Counted", "counted for more than {over} minutes", lambda *given: counted.append(1) or [])
    with monkeypatch.context() as patched:
        patched.setattr(watched.FACTS, "get", lambda looked, record: counting)
        for _ in range(3):
            watched.found(watched.Watched.parse("agent.idle", 10), context, context.agent.row)
    assert len(counted) == 1, "a fact is read once for each hook, however many triggers ask for it"
    other = fresh("u")
    Todos(other, actor=USER).create("one")
    Todos(other, actor=USER).create("two")
    idle(other)
    assert (finding(other, "todo.ready", 2), finding(other, "todo.ready", 3)) == (["ready"], []), "ready to-dos are named once there are enough and no work is open"

    from engine.gates import held
    from resources.base import Refused
    from tests.kit import tick
    for refused in ("message", "deny"):
        with pytest.raises(Refused):
            Triggers(record, actor=USER).create("never", when="state", fact="message.unread.created", does=refused)
    Triggers(record, actor=USER).create("unread for long", text="read message {{n}}", when="state", fact="message.unread.created", over=10, does="nudge")
    holder = Triggers(record, actor=USER).create("hold for unread", text="read message {{n}} first", when="state", fact="message.unread.created", over=10, does="hold")
    tick(record)
    tick(record)
    assert len([n for n in nudges(record) if "unread for long" in n]) == 1, "a trigger on a fact tells the agent once for each row it names"
    from controllers.nudges import Nudges
    said = Nudges(record, actor=SYSTEM).spoken()["triggers.nudge"]
    assert (said["day"], said["last"] > 0) == (1, True), "the journal keeps when each line was last said and how many times in the last day, so the one list of reminders can show how often each speaks"
    report(record, "working", "PreToolUse")
    assert "hold for unread" in held(record, "claude-1"), "a hold keeps the main agent's writes while the fact is true"
    assert held(record, "claude-1", subagent=True) == "", "and does not reach a subagent"
    Messages(record, actor=AGENT).read(1)
    report(record, "working", "PreToolUse")
    assert "hold for unread" not in held(record, "claude-1"), "a hold is released when the fact stops being true"
    Triggers(record, actor=USER).update(holder.n, over=1)
    Messages(record, actor=USER).create("another")
    monkeypatch.setattr(clock, "time", lambda: now + 60 * 60)
    report(record, "working", "PreToolUse")
    assert "hold for unread" in held(record, "claude-1"), "a hold holds again for a new row"
    Triggers(record, actor=USER).delete(holder.n)
    assert "hold for unread" not in held(record, "claude-1"), "and is released when its trigger is deleted"
    Triggers(record, actor=USER).create("hold again", text="read first", when="state", fact="message.unread.created", over=1, does="hold")
    record.change_setting("features", {"triggers.watching": False})
    report(record, "working", "PreToolUse")
    assert "hold again" in held(record, "claude-1"), "switching off the behaviour for words leaves a trigger on a fact running"
    record.change_setting("features", {"triggers.reminding": False})
    report(record, "working", "PreToolUse")
    assert "hold again" not in held(record, "claude-1"), "and the behaviour for facts is what switches it off"
    monkeypatch.undo()

    from framework.sending import Sent
    from tests.conftest import refused as refusal
    from framework.watched import FACTS, ClaimedTwice, Fact, UnknownFact, Watched
    with pytest.raises(ClaimedTwice):
        FACTS.register(None, Fact("agent.idle", watched.MINUTES, "Idle again", "the agent has been idle again for more than {over} minutes", lambda *given: []))
    with pytest.raises(UnknownFact):
        FACTS.get(Watched.parse("nothing.here", 1), record)
    assert "work.open.logged: work has been open for more than N minutes since its last log entry, N in minutes" in Triggers(record, actor=AGENT).facts(), \
        "the command line lists every fact this environment can watch, with what it means"
    wrong = refusal(lambda: Triggers(record, actor=AGENT).create("Percent on a minutes fact", when="state", fact="message.unread.created", over=5, does="nudge",
                                                                 text="a message has waited {{percent}}"))
    assert "never says {{percent}}" in wrong and "{{minutes}}" in wrong, \
        "a wording may only name what its fact is given: an unknown placeholder would otherwise reach the agent as its own braces, for good and without a word"
    fine = Triggers(record, actor=AGENT).create("Minutes on a minutes fact", when="state", fact="message.unread.created", over=5, does="nudge",
                                                text="a message has waited {{minutes}} minutes")
    assert fine.n, "and the placeholders the fact does fill are accepted"

    for name, over in (("message.unread.created", 10), ("work.open.logged", 10), ("agent.context", 50)):
        assert Triggers(record, actor=AGENT).matching(name, over)["matching"] == len(finding(record, name, over)), \
            f"what a trigger says {name} matches now is read through the very finder a tick uses, so the preview and the firing cannot disagree"
    full = Triggers(record, actor=AGENT).matching("agent.context", 50, "the context is {{percent}} percent full")
    assert (full["matching"], full["says"]) == (1, ("the context is 70 percent full",)), \
        "and it says what the nudge would say, with the real numbers already in it, so nobody saves a wording they have not read"
    assert Triggers(record, actor=AGENT).matching("agent.context", 99)["matching"] == 0, "a threshold nothing reaches matches nothing, which is the other thing worth seeing before saving"

    class Owner:
        on = True

        def enabled(self, record) -> bool:
            return self.on

    owner, sleepy = Owner(), Fact("test.sleepy", watched.MINUTES, "Sleepy", "it has been sleepy for more than {over} minutes", lambda *given: [Sent("x", {"n": 1})])
    FACTS.register(owner, sleepy)
    try:
        sleeper = Triggers(record, actor=USER).create("sleeps", text="wake up", when="state", fact="test.sleepy", over=1, does="nudge")
        from framework.format import shape
        from framework.switches import rebooted
        owner.on = False
        rebooted()
        assert shape(Triggers(record, actor=USER).load(sleeper.n), record)["brief"].startswith("Asleep: nothing in this journal watches test.sleepy"), \
            "a trigger reads asleep the moment its feature goes off, though nothing saved it since"
        import io
        from commands.cli import run
        printed = io.StringIO()
        run(["--root", str(record.root), "--env", record.env, "trigger", "show", str(sleeper.n)], out=printed, err=io.StringIO())
        assert "Asleep: nothing in this journal watches test.sleepy" in printed.getvalue(), "and the command line, which the agent reads it through, says the same"
        owner.on = True
        rebooted()
        assert not shape(Triggers(record, actor=USER).load(sleeper.n), record)["brief"].startswith("Asleep"), "and reads awake the moment the feature is back"
        owner.on = False
        rebooted()
        Triggers(record, actor=USER).update(sleeper.n, text="wake up now")
        assert Triggers(record, actor=USER).load(sleeper.n).brief.startswith("Asleep: nothing in this journal watches test.sleepy"), "a trigger whose fact has gone says on its row why it sleeps"
        tick(record)
        assert not [n for n in nudges(record) if "wake up" in n], "and matches nothing, raising nothing"
        assert "test.sleepy" in refusal(lambda: Triggers(record, actor=USER).update(sleeper.n, fact="test.sleepy", over=2)), "naming a fact that is gone is refused"
        Triggers(record, actor=USER).complete(sleeper.n, "not needed")
        Triggers(record, actor=USER).delete(sleeper.n, "not needed")
    finally:
        FACTS.facts.remove(sleepy)

    from migrations.m0084_a_watched_fact_names_its_clock import run as rename_facts
    old = Triggers(record, actor=USER).create("old name", text="answer {{n}}", when="state", fact="work.open.logged", over=10, does="nudge")
    path = Triggers(record, actor=USER).path(old.n)
    path.write_text(path.read_text().replace("work.open.logged", "work.unlogged"))
    assert rename_facts(record.root) == [f"trigger {old.n} watches work.open.logged"], "a trigger stored under one of the five old names is renamed"
    renamed = Triggers(record, actor=USER).load(old.n)
    assert (renamed.fact, "since its last log entry" in renamed.brief) == ("work.open.logged", True), "and its sentence is written again"
