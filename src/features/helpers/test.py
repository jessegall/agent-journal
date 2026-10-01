from pathlib import Path

import features
from controllers.types import Agents, Environments, Messages, Nudges
from engine.record import Record
from features.helper_worktrees.controller import Worktrees
from tests.kit import project_on
from features.helpers.controller import Helpers
from resources.base import AGENT, SYSTEM
from surfaces.summary import summarize
from tests.conftest import fresh, refused


def started(monkeypatch) -> list:
    calls = []
    monkeypatch.setattr("agents.terminal.detached", lambda root, cwd, env, agent, args: calls.append((cwd, env, agent, args)) or 1)
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
    assert cwd == record.root.resolve().parent and "helper 1" in said, "without a worktree it works in the project"
    place = Environments(record, actor=SYSTEM)._titled(f"{record.env}-rhea-lovelace")
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


def test_finish_packs_the_environment_away_and_drops_an_untaken_worktree(monkeypatch):
    features.load()
    calls = started(monkeypatch)
    repo = project_on("phone-connection")
    helpers = Helpers(repo.record, actor=AGENT)
    helpers.dispatch("Rhea", "Change the hooks", "codex", "gpt-5.5", worktree=True)
    row = helpers.load(1)
    cut = Worktrees(repo.record, actor=SYSTEM).load(int(row.worktree))
    assert calls[0][0] == Path(cut.path) and cut.helper == "Rhea", "a code-changing helper works in a worktree cut for it"
    from engine.worktree import checkout, environment
    assert environment(checkout(Path(cut.path))) == row.environment, "its worktree is named after its environment, so its session binds there and nowhere else"
    helpers.complete(1)
    assert not Environments(repo.record, actor=SYSTEM)._titled(f"{repo.record.env}-rhea"), "its environment is packed away"
    assert Worktrees(repo.record, actor=SYSTEM).load(cut.n).completed and not Path(cut.path).exists(), "its worktree is dropped"
    assert "is finished" in refused(lambda: helpers.say(1, "more")), "a finished helper takes no follow-up"
