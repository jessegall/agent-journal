import io
import os
import re
import shlex
import time
from pathlib import Path
from types import SimpleNamespace

import pytest

import features
from agents.terminal import launch_brief
from controllers.types import Agents, Environments, Features, Messages, Nudges, Questions, Todos
from engine.record import Record
from engine.sessions import Sessions
from providers import PROVIDERS
from runner.hooks import answer
from features.helpers.handlers import NameStoppedOrQuietHelpers
from features.parts import AgentContext
from features.helper_worktrees.controller import Worktrees
from tests.kit import project_on, run
from features.helpers.controller import Helpers
from features.plans.controller import Plans
from features.helpers.interceptors import KeepSubagentFiles, OfferKeptAgentsFirst
from features.helpers.reuse import kept
from providers.payload import Dispatch
from resources.base import AGENT, SYSTEM, USER
from resources.types import FAILED, IDLE
from overview.summary import summarize
from tests.conftest import fresh, refused


def agent_leaves(root):
    """A stop that ends the agent's session, as the real one does."""
    def stop(places, n):
        place = places.load(n)
        for session in Sessions(root).holders(place.title):
            Sessions(root).write(session, pid=2 ** 22 + 7)
        return place
    return stop


def started(monkeypatch) -> list:
    calls = []
    monkeypatch.setattr("agents.terminal.detached", lambda root, cwd, env, agent, args: calls.append((cwd, env, agent, args, launch_brief(root, env).read_text())) or 1)
    monkeypatch.setattr("providers.codex.Codex.models", lambda self: ("gpt-5.5", "gpt-6-sol"))
    return calls


def test_a_helper_starts_on_its_provider_and_model_in_an_environment_kept_out_of_the_lists(monkeypatch):
    features.load()
    calls = started(monkeypatch)
    record = fresh()
    dispatched = Helpers(record, actor=AGENT).dispatch("Rhea Lovelace", "Profile the slow hooks", "codex", "gpt-5.5", brief="Time each hook")
    row = Helpers(record, actor=AGENT).all()[0]
    (cwd, env, agent, args, kickoff), = calls
    assert (row.name, row.provider, row.model, row.environment) == ("Rhea Lovelace", "codex", "gpt-5.5", f"{record.env}-rhea-lovelace"), "the row names who, where and on what"
    assert (env, agent) == (f"{record.env}-rhea-lovelace", "codex") and args[args.index("--model") + 1] == "gpt-5.5", "it runs on the named provider and model"
    assert "Profile the slow hooks" in kickoff and "journal helper report" in kickoff, "the kickoff holds the job and how to report"
    assert (str(launch_brief(record.root, env)) in args[-1], any("slow hooks" in arg for arg in args)) == (True, False), \
        "the kickoff waits in a file beside the launch log and the command line only points at it, so pkill -f on a phrase of the job never ends a helper"
    assert "You report to Alfred" in kickoff and "never the user" in kickoff, \
        "the kickoff tells the helper to address the agent by the profile's name, never the user"
    from features.work_tracking.auto import automatic
    from controllers.types import Todos
    home = Record(record.root, f"{record.env}-rhea-lovelace")
    job, = Todos(home, actor=SYSTEM).all()
    assert (job.title, job.brief, "journal todo start 1" in kickoff, automatic(home)) == ("Profile the slow hooks", "Time each hook", True, True), \
        "its job waits as a to-do on its own list, the kickoff names it, and auto mode keeps it going"
    from controllers.types import Facts
    Facts(record, actor=AGENT).create("The viewer runs on port 8421", keywords=["port"])
    assert [f.title for f in Facts(home, actor=SYSTEM).rows.standing()] == ["The viewer runs on port 8421"], "it reads the facts of the environment that sent it"
    assert cwd == record.root.resolve().parent and "helper 1" in dispatched, "without a worktree it works in the project"
    place = Environments(record, actor=SYSTEM).rows.by_title(f"{record.env}-rhea-lovelace")
    assert place.helping and place.launched_from == record.env, "its environment is marked as the helper's and names the dispatcher"
    summary = summarize(record.root)
    assert f"{record.env}-rhea-lovelace" not in [e["name"] for e in summary["environments"]], "the hub's summary leaves it out"
    assert [(h["name"], h["owner"]) for h in summary["helpers"]] == [(f"{record.env}-rhea-lovelace", "helper:1")], \
        "and lists it apart, for the panel of agents at work"


def test_a_dispatch_names_a_known_provider_a_model_and_a_free_name(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    helpers = Helpers(record, actor=AGENT)
    assert "runs on one of" in refused(lambda: helpers.dispatch("Rhea", "a job", "gemini", "x")), "an unknown provider is refused"
    assert "model is always named" in refused(lambda: helpers.dispatch("Rhea", "a job", "codex", " ")), "the model is never left out"
    assert "gpt-5.5, gpt-6-sol" in refused(lambda: helpers.dispatch("Rhea", "a review", "codex", "gpt-5-mini")), \
        "a model the provider does not offer is refused up front, naming the ones it does"
    helpers.dispatch("Rhea", "a job", "claude", "sonnet")
    assert "exists" in refused(lambda: helpers.dispatch("Rhea", "another job", "claude", "sonnet")), "one helper per name at a time"
    assert "no letters" in refused(lambda: helpers.dispatch("!!!", "a job", "claude", "sonnet")), "a name made of no letters cannot name an environment"
    assert "not both" in refused(lambda: helpers.dispatch("Zed", "a job", "claude", "sonnet", worktree=True, checkout="platform")), "a helper works in a worktree or a checkout, never both"
    todos = Todos(record, actor=AGENT)
    finished, taken = todos.create("finished already").n, todos.create("taken already").n
    todos.complete(finished, "done")
    Todos(record, actor=SYSTEM).assign(taken, to="helper:7")
    assert "already done" in refused(lambda: helpers.dispatch("Zed", "a job", "claude", "sonnet", todos=str(finished))), "a finished to-do is not handed on"
    assert f"todo {taken} is already assigned to helper:7" in refused(lambda: helpers.dispatch("Zed", "a job", "claude", "sonnet", todos=str(taken))), \
        "a to-do one helper holds is not handed to another"
    assert "only a helper reads or marks" in refused(lambda: helpers.done(finished, "x")), "the agent that dispatched a helper closes its own to-dos itself"
    assert "no session left" in refused(lambda: helpers.say(1, "hello")), "a helper that is not running and has no session to go on in cannot be told anything"
    from engine.sessions import Sessions
    from features.agent_sessions.launch import running_in, stop_in, tell_in
    Sessions(record.root).bind("claude-8", "helper-env", provider="claude")
    assert (running_in(record, "helper-env"), running_in(record, "elsewhere"), tell_in(record, "elsewhere", "claude", "hi")) == ("claude-8", "", False), \
        "an environment with an agent seated in it is running, and nothing can be typed into one without"
    stop_in(record, "helper-env")
    stop_in(record, "elsewhere")
    mine = todos.create("hand this on").n
    helpers.dispatch("Zed", "a job", "claude", "sonnet", todos=str(mine))
    zed = Helpers(Record(record.root, helpers.load(2).environment), actor=AGENT)
    assert zed.done(mine, "handled") == f"todo {mine} is done" and todos.load(mine).completed, "a helper without a worktree closes its to-do at once"
    monkeypatch.setattr(Environments, "stop", agent_leaves(record.root))
    Sessions(record.root).bind("claude-zed", helpers.load(2).environment, pid=os.getpid(), provider="claude")
    assert Helpers(record, actor=USER).stop(2).startswith(f"helper 2, {helpers.load(2).name}: its agent is stopped") and helpers.load(2).stopped_by_user, "when you stop a helper it is remembered as stopped by you"
    Sessions(record.root).write("claude-zed", pid=2 ** 22 + 7)
    import threading
    helpers.dispatch("Quin", "a job", "claude", "sonnet")
    quin = Helpers(record, actor=SYSTEM).rows.standing()[-1]
    Sessions(record.root).bind("claude-quin", quin.environment, pid=os.getpid(), provider="claude")
    leaving = lambda: Sessions(record.root).write("claude-quin", pid=2 ** 22 + 7)
    monkeypatch.setattr(Environments, "stop", lambda self, n: (threading.Timer(0.3, leaving).start(), self.load(n))[1])
    helpers.stop(quin.n)
    helpers.complete(quin.n)
    assert Helpers(record, actor=SYSTEM).load(quin.n).completed, "a finish right after a stop waits for the agent to leave instead of answering that it still runs"
    from controllers.base import networked
    assert (networked("helper", "finish"), networked("helper", "retire"), networked("helper", "all")) == (True, True, False), \
        "a command is known to wait on the agent by the word it is called with, not only by its method's name"
    later = todos.create("handed but never launched").n
    monkeypatch.setattr("features.helpers.controller.launched", lambda *given: (_ for _ in ()).throw(RuntimeError("no terminal")))
    assert "no terminal" in refused(lambda: helpers.dispatch("Yan", "a job", "claude", "sonnet", todos=str(later))) and todos.load(later).assigned == "", \
        "a helper that cannot be launched gives back the to-dos it was handed"
    ghost = Helpers(record, actor=SYSTEM).create("Ghost job", name="Ghost", provider="claude", model="sonnet", environment="helper-env")
    assert "is still running" in refused(lambda: helpers.complete(ghost.n)), "a helper whose agent still runs is stopped before it is finished"
    lost = Helpers(record, actor=SYSTEM).create("Lost job", name="Lost", provider="claude", model="sonnet", environment="no-such-env")
    assert "has no environment left to stop" in refused(lambda: helpers.stop(lost.n)), "a helper whose environment is gone has nothing to stop"
    assert "say why" in refused(lambda: helpers.retire(lost.n)), "retiring a helper takes a reason"
    assert "Are you sure you can't reuse" in refused(lambda: helpers.retire(lost.n, why="its job is done")), "the reason is read back with the way to reuse the helper before it is retired"
    monkeypatch.setattr("features.helpers.controller.tell_in", lambda *given: True)
    assert helpers.say(ghost.n, "carry on") == "sent to Ghost", "a follow-up reaches a helper that is running"
    sent = Messages(Record(record.root, "helper-env"), actor=SYSTEM).rows.every()
    assert [(m.brief, m.data.get("from_main")) for m in sent] == [("carry on", True)], "and is kept in the helper's chat as a message from the main agent, so its inspector can show it"
    Helpers(record, actor=SYSTEM).update(ghost.n, report="done for now")
    helpers.say(ghost.n, "one more thing")
    assert helpers.load(ghost.n).report == "", "a follow-up takes the helper's earlier report away, so the menu shows it working again"
    assert helpers.load(ghost.n).latest == "one more thing", "and is kept as the latest instruction, which the helper's cell shows in place of its first job"
    assert helpers.load(ghost.n).reuses == 2, "each follow-up counts as one more use of the helper, which its cell shows"


def test_a_report_comes_back_to_the_dispatcher_as_a_message_from_the_helper_and_a_nudge(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Helpers(record, actor=AGENT).dispatch("Rhea", "Profile the slow hooks", "codex", "gpt-5.5")
    assert [c["label"] for c in Agents(record, actor=SYSTEM).primary().data["cards"]] == ["Dispatched helper 1"], "dispatching a helper shows a mark in the chat"
    Features(record, actor=SYSTEM).configure("helpers", "kept", "5")
    Features(record, actor=AGENT).configure("helpers", "kept", "12")
    Features(record, actor=AGENT).configure("helpers", "kept", "12")
    assert [c["label"] for c in Agents(record, actor=SYSTEM).primary().data["cards"]][1:] == ["Changed helpers.kept from 5 to 12"], \
        "an agent changing a setting shows a mark once, and a person's change shows none"
    from features.helpers.interceptors import runs_tests
    assert [runs_tests(c) for c in ("pytest -q -n auto", "python -m pytest", "pytest tests/a.py", "cd src/web && npx vitest run", "node src/web/browser/chat.mjs", "journal check touched 1", "ls", "git status")] == [True, True, True, True, True, True, False, False], \
        "any test run is refused to a helper or subagent, and nothing else is"
    assert not Helpers(record, actor=SYSTEM).load(1).whole_suite and Helpers(record, actor=AGENT).allow_suite(1) and Helpers(record, actor=SYSTEM).load(1).whole_suite, \
        "the dispatcher can allow one helper to run tests"
    assert "only a helper reports" in refused(lambda: Helpers(record, actor=AGENT).report("done")), "the dispatcher cannot report for it"
    sessions = Sessions(record.root)
    seated = "codex-9"
    sessions.bind(seated, f"{record.env}-rhea", provider="codex")
    watch = lambda: NameStoppedOrQuietHelpers().handle(AgentContext.of(features.FEATURES["helpers"], record, Agents(record, actor=SYSTEM).primary()), None)
    titles = lambda: [n.title for n in Nudges(record, actor=SYSTEM).all() if "helper 1" in n.title]
    watch()
    assert titles() == [], "a helper at work is left alone"
    sessions.write(seated, pid=os.getpid(), seen=time.time() - 25 * 60)
    watch()
    watch()
    assert titles() == ["helper 1, Rhea, has done nothing for 25 minutes"], "one quiet for a while is named once, so the agent checks on it"
    helper_agent = Agents(Record(record.root, f"{record.env}-rhea"), actor=SYSTEM)
    helper_agent.create("codex-9")
    helper_agent.update(helper_agent.primary_to_read().n, status="idle", at=time.time() - 3 * 60)
    idle = lambda: [t for t in titles() if "stood idle" in t]
    watch()
    watch()
    assert idle() == ["helper 1, Rhea, has stood idle for 3 minutes"], "a helper idle past the first time is named once"
    helper_agent.update(helper_agent.primary_to_read().n, at=time.time() - 13 * 60)
    watch()
    assert len(idle()) == 2, "and again once the repeat time has passed"
    Features(record, actor=SYSTEM).configure("helpers", "idle_repeats", "1")
    helper_agent.update(helper_agent.primary_to_read().n, at=time.time() - 25 * 60)
    watch()
    assert len(idle()) == 2, "no more notices than the repeats setting allows"
    speaker = AgentContext.of(features.FEATURES["helpers"], record, Agents(record, actor=SYSTEM).primary()).agent
    repeat_line = lambda minutes: speaker.say("idle", n=7, name="Zed", minutes=minutes)
    counted = lambda: len([n for n in Nudges(record, actor=SYSTEM).all() if "Zed" in n.title])
    repeat_line(4)
    repeat_line(4)
    assert counted() == 1, "a line repeated word for word with nothing said between is said once"
    repeat_line(5)
    repeat_line(5)
    assert counted() == 2, "and a line with something new in it is said again"
    away = Record(record.root, f"{record.env}-rhea")
    Questions(away, actor=AGENT).create("Which port?", options=[{"title": "8421"}, {"title": "9000"}], pick=1)
    asking, = [n for n in Nudges(record, actor=SYSTEM).all() if "asks question 1" in n.title]
    assert (asking.title, asking.until) == ("helper 1, Rhea, asks question 1 and waits for the answer", ["helper.completed", "helper.deleted"]), \
        "a question a helper asks in its own environment reaches the dispatcher at once, naming the helper and the question"
    assert "Which port? Options: 1. 8421 (its pick); 2. 9000." in asking.brief and f'journal --env "{away.env}" question answer 1' in asking.brief, \
        "the line carries the question, its options and the command that answers it in the helper's environment"
    assert features.FEATURES["helpers"].is_owed(record, "helper asking", ("helper:1",)), "it is said again while the question stays open"
    Questions(away, actor=USER).complete(1, how="8421")
    assert not features.FEATURES["helpers"].is_owed(record, "helper asking", ("helper:1",)), "and no more once it is answered"
    Questions(record, actor=AGENT, agent="agent-7").create("Which branch?", options=[{"title": "main"}, {"title": "release"}], pick=2)
    lent, = [n for n in Nudges(record, actor=SYSTEM).all() if n.title.startswith("subagent agent-7")]
    assert lent.until == ["question.completed", "question.deleted"] and "Options: 1. main; 2. release (its pick)." in lent.brief, \
        "a question a subagent asks in the environment lent to it reaches the dispatcher the same way"
    from agents.terminal import launch_log
    launch_log(record.root, f"{record.env}-rhea").parent.mkdir(parents=True, exist_ok=True)
    launch_log(record.root, f"{record.env}-rhea").write_text("\x1b[1mSettingsWarning\x1b[0m: hooks must be an object\n")
    from engine import runtime
    from supervisor import LAUNCHED
    runtime.session_file(record.root, seated, LAUNCHED).write_text(f'{{"pid": {os.getpid()}}}')
    watch()
    assert not [n for n in Nudges(record, actor=SYSTEM).all() if "stopped running" in n.title], "a helper whose agent process is alive is never named as stopped"
    sessions.write(seated, pid=2 ** 22 + 7)
    runtime.session_file(record.root, seated, LAUNCHED).write_text('{"pid": %d}' % (2 ** 22 + 9))
    watch()
    stopped, = [n for n in Nudges(record, actor=SYSTEM).all() if "stopped running" in n.title]
    assert (stopped.title, stopped.until) == ("helper 1, Rhea, stopped running before it reported", ["helper.completed", "helper.deleted"]), \
        "one whose agent is gone is named at once, and said again until it is finished"
    assert "SettingsWarning: hooks must be an object" in stopped.brief, "the notice names the cause from the tail of its launch log"
    with launch_log(record.root, f"{record.env}-rhea").open("a") as log:
        log.write("\x1b[31mYour workspace is out of credits. Ask your workspace owner to refill in order to continue.\x1b[0m\n")
    watch()
    refusal, = [n for n in Nudges(record, actor=SYSTEM).all() if "refused it" in n.title]
    assert (refusal.title, "Your workspace is out of credits" in refusal.brief) == ("helper 1, Rhea, cannot work because codex refused it", True), \
        "a Codex helper its workspace has no credits for is named at once with Codex's own words, so the job goes elsewhere"
    from providers.claude import Claude
    assert Claude.refusal_in("starting\nCredit balance is too low") == "Credit balance is too low", "Claude's refusal for want of credit is read from its output"
    Helpers(record, actor=AGENT).dispatch("Mira", "Write the hook docs", "claude", "sonnet")
    rhea, mira = (Helpers(Record(record.root, f"{record.env}-{name}"), actor=AGENT) for name in ("rhea", "mira"))
    Agents(Record(record.root, f"{record.env}-mira"), actor=SYSTEM).create("claude-mira")
    pushed = []
    monkeypatch.setattr("features.helpers.controller.tell_in", lambda home, environment, provider, text: pushed.append((provider, text)) or provider == "codex")
    assert rhea.peers() == ["helper 2, Mira, on claude: Write the hook docs"], "a helper lists the other helpers its dispatcher started"
    assert mira.say(1, "which hook is slowest?") == "sent to Rhea" and pushed[-1][0] == "codex" and 'answer with journal helper say 2 "<text>"' in pushed[-1][1], \
        "a Claude helper's words reach a Codex helper at once, with how to answer"
    asked = Messages(Record(record.root, f"{record.env}-rhea"), actor=SYSTEM).rows.every()[-1]
    assert (asked.brief, asked.data["peer"]) == ("which hook is slowest?", "Mira"), "and wait in its chat as a message from that helper"
    assert rhea.say(2, "the stop hook, 40ms") == "sent to Mira", "the Codex helper answers the Claude one the same way"
    assert any("helper 1, Rhea, wrote in message" in row.title for row in Nudges(Record(record.root, f"{record.env}-mira"), actor=SYSTEM).rows.every()), \
        "a helper busy in its turn finds the answer at its next one"
    assert "hands out to-dos" in refused(lambda: mira.say(1, "take this", todos="1")) and "that is you" in refused(lambda: mira.say(2, "hello me")), \
        "a helper sends words alone, and only to another helper"
    settings = record.root.parent / ".claude" / "settings.json"
    settings.parent.mkdir(exist_ok=True)
    settings.write_text('{"hooks": []}')
    assert "hooks that are not an object" in refused(lambda: Helpers(record, actor=AGENT).dispatch("Zoe", "a job", "codex", "gpt-5.5")), \
        "a checkout whose settings.json Claude Code would reject is not launched into"
    Helpers(Record(record.root, f"{record.env}-rhea"), actor=AGENT).report("The hooks spend 40ms in imports")
    assert Helpers(record, actor=AGENT).load(1).report == "The hooks spend 40ms in imports", "the row keeps the report"
    relayed = Messages(record, actor=SYSTEM).all()[-1]
    assert (relayed.brief, relayed.data["peer"]) == ("The hooks spend 40ms in imports", "Rhea"), "the chat shows it as a message from the helper"
    Helpers(record, actor=SYSTEM).update(1, answering=True)
    in_rhea = Record(record.root, f"{record.env}-rhea")
    Messages(in_rhea, actor=AGENT).create("Passed. Commit it.", brief="Passed. Commit it.", idempotency="turn-7")
    Messages(in_rhea, actor=AGENT).create("A question for you", brief="A question for you")
    asked_of_main = [m for m in Messages(record, actor=SYSTEM).all() if m.data.get("peer") == "Rhea" and m.brief in ("Passed. Commit it.", "A question for you")]
    assert [m.brief for m in asked_of_main] == ["A question for you"], "a helper's working notes, the words of its own turns, stay in its inspector; only what it writes to its dispatcher reaches the main chat"
    Messages(record, actor=SYSTEM).force_delete(asked_of_main[0].n)
    Helpers(record, actor=SYSTEM).update(1, answering=False)
    reported, = [n for n in Nudges(record, actor=SYSTEM).all() if "helper 1, Rhea, reported" in n.title]
    assert reported.until == ["helper.completed", "helper.deleted"], "the dispatcher is told, until it finishes the helper"
    assert not features.FEATURES["helpers"].is_owed(record, "stopped", ("helper:1",)), "once it reported, the line that it stopped is no longer owed"
    assert relayed.ref in reported.data["rows"] and features.FEATURES["helpers"].is_owed(record, "reported", tuple(reported.data["rows"])), \
        "a report is named while it stands"
    monkeypatch.setattr("features.helpers.controller.tell_in", lambda *given: True)
    Helpers(record, actor=AGENT).say(1, "Now profile the start-up too")
    assert not features.FEATURES["helpers"].is_owed(record, "reported", tuple(reported.data["rows"])), \
        "once the helper is given new work, its report is named no more"
    inside = Record(record.root, f"{record.env}-rhea")
    write = lambda text, actor=AGENT: Messages(inside, actor=actor).create(text, brief=text)
    chat = lambda: [m.brief for m in Messages(record, actor=SYSTEM).all() if m.data.get("peer") == "Rhea"]
    before = chat()
    write("the stop hook spends 12ms")
    write("a message the user wrote", USER)
    assert chat() == before + ["the stop hook spends 12ms"], "while it works a follow-up, a message its agent writes reaches the dispatcher's chat as a message from it, and the user's own does not"
    Helpers(inside, actor=AGENT).report("Both measured")
    write("one more after the report")
    assert chat()[-1] == "Both measured", "once it has reported, its messages stay in its own chat again"


def test_a_turn_that_ends_in_an_error_reports_once_for_the_helper(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Helpers(record, actor=AGENT).dispatch("Rhea", "Profile the slow hooks", "codex", "gpt-6-sol")
    place = Record(record.root, f"{record.env}-rhea")
    agents = Agents(place, actor=SYSTEM)
    row = agents.create("codex-2")
    for _ in range(2):
        agents.update(row.n, status=IDLE, event=FAILED, failure="Your workspace is out of credits.")
    relayed = [m for m in Messages(record, actor=SYSTEM).all() if m.data.get("peer") == "Rhea"]
    assert [m.brief for m in relayed] == ["My turn ended in an error, so I stopped: Your workspace is out of credits."], \
        "the dispatcher hears the error once, as the helper's report"


def test_finish_packs_the_environment_away_and_drops_an_untaken_worktree(monkeypatch):
    features.load()
    calls = started(monkeypatch)
    repo = project_on("phone-connection")
    helpers = Helpers(repo.record, actor=AGENT)
    helpers.dispatch("Rhea", "Change the hooks", "codex", "gpt-5.5", worktree=True)
    row = helpers.load(1)
    cut = Worktrees(repo.record, actor=SYSTEM).load(int(row.worktree))
    assert calls[0][0] == Path(cut.path) and cut.helper == "Rhea", "a code-changing helper works in a worktree cut for it"
    (Path(cut.path) / "only-here.txt").write_text("in the worktree\n")
    from commands.http import dispatch
    assert dispatch("GET", f"/api/{row.environment}/file", repo.record.root, {"path": "only-here.txt"}, {}).body["text"] == "in the worktree\n", \
        "a file named in the helper's environment opens from its worktree"
    (Path(cut.path) / "only-here.txt").unlink()
    from engine.worktree import checkout, environment
    from providers import workspace_folders
    assert environment(checkout(Path(cut.path), workspace_folders())) == row.environment, "its worktree is named after its environment, so its session binds there and nowhere else"
    import os
    from engine.sessions import Sessions
    from providers import PROVIDERS
    from runner.hooks import answer
    Sessions(repo.record.root).bind("main-agent", repo.record.env, pid=os.getpid(), provider="claude")
    answer(PROVIDERS["claude"](), repo.record.root, {"hook_event_name": "PreToolUse", "session_id": "main-agent", "tool_name": "Bash",
                                                     "tool_input": {"command": "git status"}, "cwd": cut.path}, os.getpid())
    assert Sessions(repo.record.root).environment("main-agent") == repo.record.env, "the main agent working in a helper's worktree stays in its own environment"
    from controllers.types import Environments as Places
    monkeypatch.setattr(Places, "stop", agent_leaves(repo.record.root))
    Sessions(repo.record.root).bind("helper-rhea", row.environment, pid=os.getpid(), provider="codex")
    assert helpers.stop(1) == f"helper 1, {helpers.load(1).name}: its agent is stopped", "the agent stops a running helper, and is told so in one sentence, never the environment's raw fields"
    Sessions(repo.record.root).write("helper-rhea", pid=2 ** 22 + 7)
    conversation = repo.record.root.parent / "rhea-conversation.jsonl"
    conversation.write_text("{}\n")
    agents = Agents(Record(repo.record.root, row.environment), actor=SYSTEM)
    agents.update(agents.by_session("helper-rhea").n, transcript=str(conversation), status="idle")
    helpers.complete(1)
    assert (helpers.load(1).session, helpers.load(1).transcript) == ("helper-rhea", str(conversation)), "retiring records where the helper's conversation is, before its environment is packed away"
    from engine.transcript import Turn
    from features.open_viewer.transcripts import Transcript
    monkeypatch.setattr(Transcript, "turns", lambda self: [Turn(1, "agent", "Done and reported", kind="agent", at=1.0)])
    assert [turn["text"] for turn in helpers.transcript(1)["turns"]] == ["Done and reported"], "a retired helper's conversation is read from the provider's own file, which retiring never touches"
    assert not Environments(repo.record, actor=SYSTEM).rows.by_title(f"{repo.record.env}-rhea"), "its environment is packed away"
    assert Worktrees(repo.record, actor=SYSTEM).load(cut.n).completed and not Path(cut.path).exists(), "its worktree is dropped"
    assert "is finished" in refused(lambda: helpers.say(1, "more")), "a finished helper takes no follow-up"
    helpers.dispatch("Sol", "Change the hooks", "codex", "gpt-5.5")
    gone = helpers.load(2).environment
    places = Environments(repo.record, actor=SYSTEM)
    places.force_delete(places.rows.by_title(gone).n)
    folder = repo.record.root / "environments" / gone
    folder.mkdir(parents=True, exist_ok=True)
    helpers.complete(2)
    assert not folder.exists() and list((repo.record.root / "attic").glob(f"{gone}-*")), "finish packs the folder into the attic even when its environment row is gone"
    todos = Todos(repo.record, actor=SYSTEM)
    handed = todos.create("handed to a helper that breaks while it finishes").n
    helpers.dispatch("Tor", "Change the hooks", "codex", "gpt-5.5", todos=str(handed))

    class ReleaseBroke(Exception):
        pass
    monkeypatch.setattr(Worktrees, "_released", lambda self, helper: (_ for _ in ()).throw(ReleaseBroke()))
    with pytest.raises(ReleaseBroke):
        helpers.complete(3)
    assert (bool(helpers.load(3).completed), todos.load(handed).assigned) == (True, ""), "a finish that breaks after the helper is done has already given back its to-dos"
    kept = todos.create("kept by a helper that finished before finishing gave rows back").n
    todos.assign(kept, to=helpers.load(2).ref)
    from migrations.m0076_finished_helpers_give_back_todos import run as given_back_on_upgrade
    assert given_back_on_upgrade(repo.record.root) == [f"to-do {kept} in {repo.record.env} is given back from {helpers.load(2).ref}, which had finished"], \
        "an upgrade gives back every open to-do a finished helper still holds"
    assert todos.load(kept).assigned == "", "the to-do is free again"
    helpers.dispatch("Uma", "Change the hooks", "codex", "gpt-5.5", todos=str(kept))
    assert todos.load(kept).assigned == helpers.load(4).ref, "and it can be handed to a helper again"


def test_to_dos_handed_to_a_helper_are_its_alone_wait_as_done_until_taken_and_come_back_when_it_stops(monkeypatch):
    from features.kanban.lanes import DONE, Sources, lane_of
    from tests.kit import commit
    features.load()
    calls = started(monkeypatch)
    repo = project_on("phone-connection")
    todos = Todos(repo.record, actor=AGENT)
    fixed, dropped, left = (todos.create(title).n for title in ("fix the tunnel", "name the cause", "test the dialog"))
    helpers = Helpers(repo.record, actor=AGENT)
    plans = Plans(repo.record, actor=AGENT)
    plan = plans.create("Tunnel work")
    plans.phase(plan.n, "Fix", when="fixed")
    plans.place(plan.n, 1, [fixed])
    plans.update(plan.n, status="active")
    helpers.dispatch("Rhea", "The tunnel", "codex", "gpt-5.5", worktree=True, todos=f"{fixed},{dropped},{left}")
    assert plans.load(plan.n).delegated, "handing a helper a row of a plan's current phase delegates the plan"
    from features.plans.summary import helping, open_tickets
    listed = helping(repo.record, plans.load(plan.n))
    assert ([(h["name"], h["job"]) for h in listed], bool(listed[0]["branch"]), open_tickets(repo.record, plans.load(plan.n))) == ([("Rhea", "The tunnel")], True, []), \
        "the plan names the helper working its phase, with its job and branch, and no tickets are open on it"
    row = helpers.load(1)
    helper = Helpers(Record(repo.record.root, row.environment), actor=AGENT)
    assert todos.load(fixed).assigned == row.ref and f"to-do {fixed}: fix the tunnel" in calls[0][4], "the rows are handed over and the kickoff names them"
    for closing in (lambda: todos.complete(fixed, "done here"), lambda: todos.strike(fixed, "not needed"), lambda: todos.unassign(fixed)):
        assert "journal helper stop 1 gives it back first" in refused(closing), "the agent that dispatched it cannot close, strike or take back a handed row"
    assert "assigned to helper:1" in refused(lambda: todos.start(fixed)), "nor start it"
    assert "not handed to you" in refused(lambda: helper.done(todos.create("another").n, "x"))
    read = helper.todo(fixed)
    assert read.startswith(f"to-do {fixed}: fix the tunnel") and "not handed to you" in refused(lambda: helper.todo(todos.create("one more").n)), \
        "a helper reads a to-do handed to it by the number the dispatching agent knows, and only those"
    assert "only a helper reads" in refused(lambda: Helpers(repo.record, actor=AGENT).todo(fixed)), "the agent that dispatched it works its own list instead"
    own = Todos(Record(repo.record.root, row.environment), actor=SYSTEM)
    assert sorted(t.title for t in own.rows.standing() if t.handed) == ["fix the tunnel", "name the cause", "test the dialog"], "its own list holds each handed to-do"
    helper.done(fixed, "restarts within seconds")
    assert [t.title for t in own.rows.standing() if t.handed] == ["name the cause", "test the dialog"], "marking one done closes its copy on the helper's list"
    marked = todos.load(fixed)
    assert not marked.completed and lane_of(Sources(todos), marked) == DONE, "a row the helper marks shows as done, waiting for its merge"
    commit(Path(Worktrees(repo.record, actor=SYSTEM).load(int(row.worktree)).path), "tunnel.txt", "fixed\n")
    from features.helpers.reuse import unlanded
    commit(Path(Worktrees(repo.record, actor=SYSTEM).load(int(row.worktree)).path), "test_tunnel.py", "def test_it(): pass\n")
    assert unlanded(repo.record, row) == ("write tunnel.txt", "write test_tunnel.py"), "a commit on a helper's branch that the project's branch lacks is named"
    from features.helpers.reuse import written_tests
    assert written_tests(repo.record, row) == ("test_tunnel.py",), "and the tests it wrote are listed, for the agent that dispatched it to run"
    assert f"closed to-do {fixed}" in Worktrees(repo.record, actor=SYSTEM).take(int(row.worktree)) and todos.load(fixed).completed, "taking its work closes it"
    assert unlanded(repo.record, row) == (), "once its commit is taken over by cherry-pick it counts as landed, though its hash is new"
    named = re.search(r"journal (helper done <n> .*?<what landed>.)", calls[0][4]).group(1).replace("<n>", str(dropped)).replace("<what landed>", "names the cause")
    assert run(["--root", str(repo.record.root), "--env", row.environment, *shlex.split(named)], out=io.StringIO(), err=io.StringIO()) == 0 and todos.load(dropped).pending, "the command the kickoff names marks the row"
    assert "gives it back first" in refused(lambda: todos.reopen(dropped, "not yet")), "the agent cannot unmark a row the helper marked"
    Todos(repo.record, actor=USER).reopen(dropped, "not yet")
    assert not todos.load(dropped).pending and todos.load(dropped).assigned == row.ref, "you can pull a row waiting for its merge back, and it stays the helper's"
    helper.done(dropped, "names the cause")
    monkeypatch.setattr(Environments, "stop", agent_leaves(repo.record.root))
    assert helpers.stop(1).endswith(f"given back: to-do {left}") and todos.load(left).assigned == "", "stopping the helper gives back what it did not mark"
    Worktrees(repo.record, actor=SYSTEM).complete(int(row.worktree))
    assert (todos.load(dropped).assigned, todos.load(dropped).pending) == ("", None), "dropping its worktree untaken gives back what waited for the merge"
    stranded = Todos(repo.record, actor=SYSTEM).create("held by a helper that is gone").n
    Todos(repo.record, actor=SYSTEM).assign(stranded, to="helper:99")
    assert todos.unassign(stranded).assigned == "", "a row held by a helper that no longer exists is the agent's to take back"
    sent_texts = []
    monkeypatch.setattr("features.helpers.controller.tell_in", lambda record, environment, provider, text: sent_texts.append(text) or True)
    helpers.dispatch("Tess", "More tunnel work", "codex", "gpt-5.5")
    later = todos.create("check the certificate").n
    helpers.say(helpers.all()[-1].n, "also this one", todos=str(later))
    assert (todos.load(later).assigned, "check the certificate" in sent_texts[-1], sent_texts[-1].endswith("also this one")) == (helpers.all()[-1].ref, True, True), \
        "a follow-up with --todos hands a running helper those rows and names them in what it is told"
    tess = helpers.all()[-1]
    helpers.dispatch("Uma", "Take over", "codex", "gpt-5.5")
    uma = helpers.all()[-1]
    helpers.say(uma.n, "take this over", todos=str(later))
    tess_list = Todos(Record(repo.record.root, tess.environment), actor=SYSTEM)
    assert (todos.load(later).assigned, [t.title for t in tess_list.rows.standing() if t.handed == str(later)]) == (uma.ref, []), \
        "a to-do held by one helper moves to another with helper say --todos, and leaves the first helper's own list"
    assert any(f"now belongs to helper {uma.n}, Uma" in text for text in sent_texts), "and the first helper is told it left"
    assert "moves it to another helper" in refused(lambda: todos.assign(later, tess.ref)), "todo assign names the command that moves a held to-do"


def test_a_helper_launches_in_a_nested_checkout_named_by_its_path(monkeypatch, tmp_path):
    features.load()
    calls = started(monkeypatch)
    record = fresh()
    project = record.root.resolve().parent
    (project / "platform" / ".git").mkdir(parents=True)
    (project / "docs").mkdir()
    helpers = Helpers(record, actor=AGENT)
    helpers.dispatch("Ada", "review the queue", "claude", "sonnet", checkout="platform")
    (cwd, _, _, _, kickoff), = calls
    assert (cwd, helpers.all()[0].checkout) == (project / "platform", str(project / "platform")), "it launches in the nested checkout, and the row names it"
    assert str(project / "platform") in kickoff, "the kickoff names the checkout it works in"
    assert "not a git checkout" in refused(lambda: helpers.dispatch("Bo", "a job", "claude", "sonnet", checkout="docs")), "a folder that is no checkout is refused"
    assert "inside the project" in refused(lambda: helpers.dispatch("Bo", "a job", "claude", "sonnet", checkout=str(tmp_path))), "a checkout outside the project is refused"
    assert "either" in refused(lambda: helpers.dispatch("Bo", "a job", "claude", "sonnet", checkout="platform", worktree=True)), "a checkout and a worktree are never both given"
    first = helpers.all()[0]
    Environments(record, actor=SYSTEM).complete(Environments(record, actor=SYSTEM).rows.by_title(first.environment).n, how="its helper stopped", yes=True)
    helpers.dispatch("Ada", "carry on with the queue", "claude", "sonnet", checkout="platform")
    assert [h.title for h in helpers.all()] == ["carry on with the queue"] and helpers.load(first.n).completed, \
        "a helper started again in a stopped helper's environment takes its place: the stopped row is closed, never listed twice"
    place = helpers.all()[0].environment
    answer(PROVIDERS["claude"](), record.root, {"hook_event_name": "SessionStart", "session_id": "ada-session", "cwd": str(project / "platform")}, os.getpid(), place)
    assert place != "platform" and Sessions(record.root).holder(place) == "ada-session", \
        "a checkout named unlike its environment: its session binds to the environment it was launched for, so it is found and can be told"


def test_a_helper_is_working_idle_needing_you_reported_stopped_or_finished_by_what_its_agent_last_did():
    from types import SimpleNamespace
    from features.helpers.state import HelperSnapshot, WorkState, helper_reason, helper_state
    row = lambda **given: SimpleNamespace(**{"completed": False, "report": "", "stopped_by_user": False, **given})
    snapshot = lambda **given: HelperSnapshot.from_payload(given)
    running = {"status": "working", "at": 1000.0}
    states = [helper_state(row(), snapshot(agent=running), 1100.0), helper_state(row(), snapshot(agent=running), 2000.0),
              helper_state(row(), snapshot(agent=running, attention={"kind": "question", "text": "which?"}), 1100.0),
              helper_state(row(report="done"), snapshot(agent=running), 1100.0), helper_state(row(completed=True, report="done"), snapshot(), 1100.0),
              helper_state(row(), snapshot(), 1100.0), helper_state(row(stopped_by_user=True), snapshot(agent={"status": "stopped"}), 1100.0)]
    assert states == [WorkState.WORKING, WorkState.IDLE, WorkState.NEEDS, WorkState.REPORTED, WorkState.FINISHED, WorkState.ENDED, WorkState.STOPPED], \
        "a helper is working while its agent was active in the last five minutes, idle after, and needs you when it asks"
    reasons = [helper_reason(snapshot(attention={"kind": kind, "text": "which?"}), 0.0) for kind in ("question", "permission")]
    assert reasons == ["Asks a question: which?", "Wants a permission: which?"], "what a helper needs is said in its own words"
    assert (helper_reason(snapshot(silent=True, agent=running), 1000.0 + 20 * 60), helper_reason(snapshot(), 0.0)) == ("Silent for 20 min", ""), \
        "a silent helper says for how long, and one that needs nothing says nothing"


def test_a_report_and_a_finish_answer_first_and_do_their_slow_work_after_the_answer(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    helpers = Helpers(record, actor=AGENT)
    helpers.dispatch("Rhea", "Profile the slow hooks", "codex", "gpt-5.5")
    from engine import bus
    with bus.held() as queue:
        Helpers(Record(record.root, f"{record.env}-rhea"), actor=AGENT).report("Done")
        assert not Messages(record, actor=SYSTEM).all() and Helpers(record, actor=AGENT).load(1).report == "Done", "the answer holds the report, not yet its message"
        helpers.complete(1)
        assert Environments(record, actor=SYSTEM).rows.by_title(f"{record.env}-rhea"), "the environment is still unpacked when finish answers"
    bus.release(queue)
    assert Messages(record, actor=SYSTEM).all()[-1].brief == "Done", "the message follows the answer"
    assert not Environments(record, actor=SYSTEM).rows.by_title(f"{record.env}-rhea"), "the packing follows the answer"


def test_related_work_goes_to_an_agent_that_knows_it_and_the_kept_ones_hold_back_a_new_dispatch(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    project, helpers = record.root.resolve().parent, Helpers(record, actor=AGENT)
    record.set_setting("helpers", {"kept": 0})
    runs = lambda row, pid=os.getpid(): Sessions(record.root).bind(f"{row.name}-agent", row.environment, pid=pid, provider="claude")
    helpers.dispatch("Rhea", "profile the hooks", "claude", "sonnet")
    helpers.dispatch("Zed", "fix src/features/nudges/standing.py", "claude", "sonnet")
    runs(helpers.load(1))
    runs(helpers.load(2))
    monkeypatch.setattr("features.helpers.reuse.touched", lambda record, row: ("src/features/nudges/standing.py",) if row.name == "Zed" else ())
    Agents(Record(record.root, helpers.load(2).environment), actor=SYSTEM).create("claude-zed", status=IDLE, at=time.time() - 600)
    named = refused(lambda: helpers.dispatch("Ivy", "tidy nudges/standing.py", "claude", "sonnet"))
    assert "helper 2, Zed" in named and "helper 1" not in named and 'journal helper say 2 "<the new work>"' in named, \
        "a dispatch is refused while an idle helper touched the files its job names, naming it with the line that sends it the work"
    helpers.dispatch("Ivy", "tidy the docs", "claude", "sonnet")
    runs(helpers.load(3))
    record.set_setting("helpers", {"kept": 3})
    held_back = refused(lambda: helpers.dispatch("Bo", "change nudges/standing.py again", "claude", "sonnet"))
    assert held_back.index("helper 2, Zed") < held_back.index("helper 1, Rhea") and 'journal helper say 2 "<the new work>"' in held_back, \
        "at the limit, with one idle, a dispatch is refused: the ones that touched the same files come first, with the line that sends them the work"
    guard = OfferKeptAgentsFirst()
    context = AgentContext.of(features.FEATURES["helpers"], record, Agents(record, actor=SYSTEM).create("claude-1", provider="claude"))
    asked = lambda kind: guard.cancel(context, Dispatch(kind=kind, model="sonnet", model_supported=True, description="Ada: map the hooks"))
    assert (asked("reviewer"), asked("explore")) == ("", ""), "a reviewer always starts fresh, and an idle helper of another type never has to go to make room for an explorer"
    record.set_setting("helpers", {"kept": 3, "working": 2})
    for row in helpers.rows.standing()[:2]:
        Agents(Record(record.root, row.environment), actor=SYSTEM).create("working", status="working", at=time.time())
    assert "2 agents work at once" in refused(lambda: helpers.dispatch("Cy", "another job", "claude", "sonnet")), "the working cap holds a new dispatch whatever the type"
    record.set_setting("helpers", {"kept": 3, "working": 6})
    for row in helpers.rows.standing():
        Agents(Record(record.root, row.environment), actor=SYSTEM).create("busy", status="working", at=time.time())
    assert "started" in helpers.dispatch("Bo", "change nudges/standing.py again", "claude", "sonnet"), "when every kept one is busy the dispatch goes through"
    import subprocess
    gone = subprocess.Popen(["true"])
    gone.wait()
    runs(helpers.load(3), gone.pid)
    from features.helpers.reuse import agent_runs
    assert (agent_runs(record, helpers.load(2)), agent_runs(record, helpers.load(3))) == (True, False), "a helper whose agent process is gone is not one that runs"
    assert "helper 3, Ivy" not in [k.name for k in kept(record, helpers.rows.standing())], "and it is not one of the helpers kept for reuse, so it holds no place against the limit"
    assert "no agent running" in helpers.stop(3) and not helpers.load(3).completed, "stopping it says that its agent is gone instead of refusing"
    assert helpers.complete(3).completed, "and finishing it then works, since the same check says its agent does not run"
    monkeypatch.setattr(Environments, "stop", lambda self, n: (Sessions(record.root).write("Zed-agent", pid=gone.pid), self.load(n))[1])
    assert "stopped" in helpers.stop(2) and not agent_runs(record, helpers.load(2)), "a stop returns only once the agent no longer runs"
    assert helpers.complete(2).completed, "so a finish right after a stop succeeds at once"
    Agents(record, actor=SYSTEM).update(context.agent.row.n, subagent_rows=[{"id": "toolu_1", "task": "Ada: map the hooks", "type": "explore", "session": "a1"}])
    child = Agents(record, actor=SYSTEM).create("a1", parent="claude-1")
    KeepSubagentFiles().intercept(AgentContext.of(features.FEATURES["helpers"], record, child), SimpleNamespace(paths=(str(project / "src" / "hooks.py"),)))
    ada, = [k for k in kept(record, []) if k.kind == "explore"]
    assert (ada.files, ada.message) == (("src/hooks.py",), 'SendMessage({to: "a1", message: "<the new work>"})'), \
        "a subagent keeps the files it touched, and is offered with its provider's line for a follow-up"
    assert "is not one of your subagents" in refused(lambda: Agents(record, actor=AGENT).action("retire")("a9")), "only one of your own subagents is retired"
    Agents(record, actor=AGENT).action("retire")("a1")
    assert [k for k in kept(record, []) if k.kind == "explore"] == [], "a retired subagent frees its place"
    Agents(record, actor=SYSTEM).update(context.agent.row.n, subagent_rows=[{"id": "toolu_2", "task": "Bea: draw it", "type": "designer", "status": "refused"}])
    assert [k for k in kept(record, []) if k.kind == "designer"] == [], "a dispatch the limit refused never takes a place"
