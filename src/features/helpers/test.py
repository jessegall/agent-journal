import io
import os
import re
import shlex
import time
from pathlib import Path
from types import SimpleNamespace

import features
from controllers.types import Agents, Environments, Messages, Nudges, Todos
from engine.record import Record
from engine.sessions import Sessions
from providers import PROVIDERS
from runner.hooks import answer
from features.helpers.handlers import NameStoppedOrQuietHelpers
from features.parts import AgentContext
from features.helper_worktrees.controller import Worktrees
from tests.kit import project_on, run
from features.helpers.controller import Helpers
from features.helpers.interceptors import KeepSubagentFiles, OfferKeptAgentsFirst
from features.helpers.reuse import kept
from providers.payload import Dispatch
from resources.base import AGENT, SYSTEM, USER
from resources.types import FAILED, IDLE
from overview.summary import summarize
from tests.conftest import fresh, refused


def started(monkeypatch) -> list:
    calls = []
    monkeypatch.setattr("agents.terminal.detached", lambda root, cwd, env, agent, args: calls.append((cwd, env, agent, args)) or 1)
    monkeypatch.setattr("providers.codex.Codex.models", lambda self: ("gpt-5.5", "gpt-6-sol"))
    return calls


def test_a_helper_starts_on_its_provider_and_model_in_an_environment_kept_out_of_the_lists(monkeypatch):
    features.load()
    calls = started(monkeypatch)
    record = fresh()
    said = Helpers(record, actor=AGENT).dispatch("Rhea Lovelace", "Profile the slow hooks", "codex", "gpt-5.5", brief="Time each hook")
    row = Helpers(record, actor=AGENT).all()[0]
    (cwd, env, agent, args), = calls
    assert (row.name, row.provider, row.model, row.environment) == ("Rhea Lovelace", "codex", "gpt-5.5", f"{record.env}-rhea-lovelace"), "the row names who, where and on what"
    assert (env, agent) == (f"{record.env}-rhea-lovelace", "codex") and args[args.index("--model") + 1] == "gpt-5.5", "it runs on the named provider and model"
    assert "Profile the slow hooks" in args[-1] and "journal helper report" in args[-1], "the kickoff holds the job and how to report"
    from features.work_tracking.auto import automatic
    from controllers.types import Todos
    home = Record(record.root, f"{record.env}-rhea-lovelace")
    job, = Todos(home, actor=SYSTEM).all()
    assert (job.title, job.brief, "journal todo start 1" in args[-1], automatic(home)) == ("Profile the slow hooks", "Time each hook", True, True), \
        "its job waits as a to-do on its own list, the kickoff names it, and auto mode keeps it going"
    from controllers.types import Facts
    Facts(record, actor=AGENT).create("The viewer runs on port 8421", keywords=["port"])
    assert [f.title for f in Facts(home, actor=SYSTEM).rows.standing()] == ["The viewer runs on port 8421"], "it reads the facts of the environment that sent it"
    assert cwd == record.root.resolve().parent and "helper 1" in said, "without a worktree it works in the project"
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
    assert "only a helper marks" in refused(lambda: helpers.done(finished, "x")), "the agent that dispatched a helper closes its own to-dos itself"
    assert "is not running" in refused(lambda: helpers.say(1, "hello")), "a helper that is not running cannot be told anything"
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
    monkeypatch.setattr(Environments, "stop", lambda self, n: "stopped")
    assert Helpers(record, actor=USER).stop(2).startswith("stopped") and helpers.load(2).stopped_by_user, "when you stop a helper it is remembered as stopped by you"
    later = todos.create("handed but never launched").n
    monkeypatch.setattr("features.helpers.controller.launched", lambda *given: (_ for _ in ()).throw(RuntimeError("no terminal")))
    assert "no terminal" in refused(lambda: helpers.dispatch("Yan", "a job", "claude", "sonnet", todos=str(later))) and todos.load(later).assigned == "", \
        "a helper that cannot be launched gives back the to-dos it was handed"
    ghost = Helpers(record, actor=SYSTEM).create("Ghost job", name="Ghost", provider="claude", model="sonnet", environment="helper-env")
    assert "is still running" in refused(lambda: helpers.complete(ghost.n)), "a helper whose agent still runs is stopped before it is finished"
    lost = Helpers(record, actor=SYSTEM).create("Lost job", name="Lost", provider="claude", model="sonnet", environment="no-such-env")
    assert "has no environment left to stop" in refused(lambda: helpers.stop(lost.n)), "a helper whose environment is gone has nothing to stop"
    monkeypatch.setattr("features.helpers.controller.tell_in", lambda *given: True)
    assert helpers.say(ghost.n, "carry on") == "sent to Ghost", "a follow-up reaches a helper that is running"


def test_a_report_comes_back_to_the_dispatcher_as_a_message_from_the_helper_and_a_nudge(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Helpers(record, actor=AGENT).dispatch("Rhea", "Profile the slow hooks", "codex", "gpt-5.5")
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
    sessions.write(seated, pid=2 ** 22 + 7)
    watch()
    stopped, = [n for n in Nudges(record, actor=SYSTEM).all() if "stopped running" in n.title]
    assert (stopped.title, stopped.until) == ("helper 1, Rhea, stopped running before it reported", ["helper.completed", "helper.deleted"]), \
        "one whose agent is gone is named at once, and said again until it is finished"
    Helpers(Record(record.root, f"{record.env}-rhea"), actor=AGENT).report("The hooks spend 40ms in imports")
    assert Helpers(record, actor=AGENT).load(1).report == "The hooks spend 40ms in imports", "the row keeps the report"
    told = Messages(record, actor=SYSTEM).all()[-1]
    assert (told.brief, told.data["peer"]) == ("The hooks spend 40ms in imports", "Rhea"), "the chat shows it as a message from the helper"
    reported, = [n for n in Nudges(record, actor=SYSTEM).all() if "helper 1, Rhea, reported" in n.title]
    assert reported.until == ["helper.completed", "helper.deleted"], "the dispatcher is told, until it finishes the helper"
    assert not features.FEATURES["helpers"].is_owed(record, "stopped", ("helper:1",)), "once it reported, the line that it stopped is no longer owed"


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
    told = [m for m in Messages(record, actor=SYSTEM).all() if m.data.get("peer") == "Rhea"]
    assert [m.brief for m in told] == ["My turn ended in an error, so I stopped: Your workspace is out of credits."], \
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
    monkeypatch.setattr(Places, "stop", lambda self, n: "stopped")
    assert helpers.stop(1) == "stopped", "the agent stops a running helper"
    helpers.complete(1)
    assert not Environments(repo.record, actor=SYSTEM).rows.by_title(f"{repo.record.env}-rhea"), "its environment is packed away"
    assert Worktrees(repo.record, actor=SYSTEM).load(cut.n).completed and not Path(cut.path).exists(), "its worktree is dropped"
    assert "is finished" in refused(lambda: helpers.say(1, "more")), "a finished helper takes no follow-up"


def test_to_dos_handed_to_a_helper_are_its_alone_wait_as_done_until_taken_and_come_back_when_it_stops(monkeypatch):
    from features.kanban.lanes import DONE, Sources, lane_of
    from tests.kit import commit
    features.load()
    calls = started(monkeypatch)
    repo = project_on("phone-connection")
    todos = Todos(repo.record, actor=AGENT)
    fixed, dropped, left = (todos.create(title).n for title in ("fix the tunnel", "name the cause", "test the dialog"))
    helpers = Helpers(repo.record, actor=AGENT)
    helpers.dispatch("Rhea", "The tunnel", "codex", "gpt-5.5", worktree=True, todos=f"{fixed},{dropped},{left}")
    row = helpers.load(1)
    helper = Helpers(Record(repo.record.root, row.environment), actor=AGENT)
    assert todos.load(fixed).assigned == row.ref and f"to-do {fixed}: fix the tunnel" in calls[0][3][-1], "the rows are handed over and the kickoff names them"
    for closing in (lambda: todos.complete(fixed, "done here"), lambda: todos.strike(fixed, "not needed"), lambda: todos.unassign(fixed)):
        assert "journal helper stop 1 gives it back first" in refused(closing), "the agent that dispatched it cannot close, strike or take back a handed row"
    assert "assigned to helper:1" in refused(lambda: todos.start(fixed)), "nor start it"
    assert "not handed to you" in refused(lambda: helper.done(todos.create("another").n, "x"))
    helper.done(fixed, "restarts within seconds")
    marked = todos.load(fixed)
    assert not marked.completed and lane_of(Sources(todos), marked) == DONE, "a row the helper marks shows as done, waiting for its merge"
    commit(Path(Worktrees(repo.record, actor=SYSTEM).load(int(row.worktree)).path), "tunnel.txt", "fixed\n")
    assert f"closed to-do {fixed}" in Worktrees(repo.record, actor=SYSTEM).take(int(row.worktree)) and todos.load(fixed).completed, "taking its work closes it"
    named = re.search(r"journal (helper done <n> .*?<what landed>.)", calls[0][3][-1]).group(1).replace("<n>", str(dropped)).replace("<what landed>", "names the cause")
    assert run(["--root", str(repo.record.root), "--env", row.environment, *shlex.split(named)], out=io.StringIO(), err=io.StringIO()) == 0 and todos.load(dropped).pending, "the command the kickoff names marks the row"
    assert "gives it back first" in refused(lambda: todos.reopen(dropped, "not yet")), "the agent cannot unmark a row the helper marked"
    Todos(repo.record, actor=USER).reopen(dropped, "not yet")
    assert not todos.load(dropped).pending and todos.load(dropped).assigned == row.ref, "you can pull a row waiting for its merge back, and it stays the helper's"
    helper.done(dropped, "names the cause")
    monkeypatch.setattr(Environments, "stop", lambda self, n: "stopped")
    assert helpers.stop(1).endswith(f"given back: to-do {left}") and todos.load(left).assigned == "", "stopping the helper gives back what it did not mark"
    Worktrees(repo.record, actor=SYSTEM).complete(int(row.worktree))
    assert (todos.load(dropped).assigned, todos.load(dropped).pending) == ("", None), "dropping its worktree untaken gives back what waited for the merge"


def test_a_helper_launches_in_a_nested_checkout_named_by_its_path(monkeypatch, tmp_path):
    features.load()
    calls = started(monkeypatch)
    record = fresh()
    project = record.root.resolve().parent
    (project / "platform" / ".git").mkdir(parents=True)
    (project / "docs").mkdir()
    helpers = Helpers(record, actor=AGENT)
    helpers.dispatch("Ada", "review the queue", "claude", "sonnet", checkout="platform")
    (cwd, _, _, args), = calls
    assert (cwd, helpers.all()[0].checkout) == (project / "platform", str(project / "platform")), "it launches in the nested checkout, and the row names it"
    assert str(project / "platform") in args[-1], "the kickoff names the checkout it works in"
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
    helpers.dispatch("Rhea", "profile the hooks", "claude", "sonnet")
    helpers.dispatch("Zed", "fix src/features/nudges/standing.py", "claude", "sonnet")
    monkeypatch.setattr("features.helpers.reuse.touched", lambda record, row: ("src/features/nudges/standing.py",) if row.name == "Zed" else ())
    Agents(Record(record.root, helpers.load(2).environment), actor=SYSTEM).create("claude-zed", status=IDLE, at=time.time() - 600)
    started_answer = helpers.dispatch("Ivy", "tidy nudges/standing.py", "claude", "sonnet")
    assert "helper 2, Zed" in started_answer and "helper 1" not in started_answer, "a new helper's answer names the idle one that touched the files its job names"
    record.set_setting("helpers", {"kept": 3})
    held_back = refused(lambda: helpers.dispatch("Bo", "change nudges/standing.py again", "claude", "sonnet"))
    assert held_back.index("helper 2, Zed") < held_back.index("helper 1, Rhea") and 'journal helper say 2 "<the new work>"' in held_back, \
        "at the limit, with one idle, a dispatch is refused: the ones that touched the same files come first, with the line that sends them the work"
    guard = OfferKeptAgentsFirst()
    context = AgentContext.of(features.FEATURES["helpers"], record, Agents(record, actor=SYSTEM).create("claude-1", provider="claude"))
    asked = lambda kind: guard.cancel(context, Dispatch(kind=kind, model="sonnet", model_supported=True, description="Ada: map the hooks"))
    assert (asked("reviewer"), "of this kind (explore)" in asked("explore")) == ("", True), "a reviewer always starts fresh, and kinds stay apart"
    for row in helpers.rows.standing():
        Agents(Record(record.root, row.environment), actor=SYSTEM).create("busy", status="working", at=time.time())
    assert "started" in helpers.dispatch("Bo", "change nudges/standing.py again", "claude", "sonnet"), "when every kept one is busy the dispatch goes through"
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
