import io
import re
import shlex
from pathlib import Path

import features
from controllers.types import Agents, Environments, Messages, Nudges, Todos
from engine.record import Record
from features.helper_worktrees.controller import Worktrees
from tests.kit import project_on, run
from features.helpers.controller import Helpers
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


def test_a_report_comes_back_to_the_dispatcher_as_a_message_from_the_helper_and_a_nudge(monkeypatch):
    features.load()
    started(monkeypatch)
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    Helpers(record, actor=AGENT).dispatch("Rhea", "Profile the slow hooks", "codex", "gpt-5.5")
    assert "only a helper reports" in refused(lambda: Helpers(record, actor=AGENT).report("done")), "the dispatcher cannot report for it"
    Helpers(Record(record.root, f"{record.env}-rhea"), actor=AGENT).report("The hooks spend 40ms in imports")
    assert Helpers(record, actor=AGENT).load(1).report == "The hooks spend 40ms in imports", "the row keeps the report"
    told = Messages(record, actor=SYSTEM).all()[-1]
    assert (told.brief, told.data["peer"]) == ("The hooks spend 40ms in imports", "Rhea"), "the chat shows it as a message from the helper"
    assert any("helper 1, Rhea, reported" in n.title for n in Nudges(record, actor=SYSTEM).all()), "the dispatcher is told"


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
