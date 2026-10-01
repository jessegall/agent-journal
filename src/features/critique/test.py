import features
from controllers.types import Agents, Nudges, Reports
from engine.record import Record
from features.critique.controller import Critiques
from features.helpers.controller import Helpers
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh, refused


def test_a_round_sends_one_critic_per_lens_and_gathers_their_findings_into_one_report(monkeypatch):
    features.load()
    launched = []
    monkeypatch.setattr("agents.terminal.detached", lambda root, cwd, env, agent, args: launched.append(args[-1]) or 1)
    up = {"answers": False}
    monkeypatch.setattr("features.critique.controller.answers", lambda url: up["answers"])
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    critiques = Critiques(record, actor=AGENT)
    assert "name the app" in refused(lambda: critiques.round("the helper list")), "a round needs the app's address first"
    record.set_setting("critique", {"app": "http://127.0.0.1:8611/p/", "login": "/tmp/state.json", "browsers": "/tmp/pw"})
    assert "does not answer" in refused(lambda: critiques.round("the helper list")), "an app that does not answer is refused in words"
    up["answers"] = True
    assert "no lens colour" in refused(lambda: critiques.round("the helper list", lenses="words,colour")), "an unknown lens is named with the list"
    said = critiques.round("the helper list", lenses="first-time,words")
    row = critiques.all()[0]
    assert [c["lens"] for c in row.critics] == ["first-time", "words"] and "2 critics out" in said, "one critic per lens"
    assert len(launched) == 2 and all("round.md" in kickoff and "journal helper report" in kickoff for kickoff in launched), \
        "each critic is told where the round's page is and how to report"
    for critic, found in zip(row.critics, ("the empty state says nothing", "Doing now reads like jargon")):
        place = Helpers(record, actor=SYSTEM).load(critic["helper"]).environment
        Helpers(Record(record.root, place), actor=AGENT).report(found)
    parts = [part["title"] for part in Reports(record, actor=SYSTEM).load(row.report).sections]
    assert parts == ["Rosa Firstlook, first-time", "Strunk Plain, words"], "every critic's findings become a part of the round's report"
    assert [n for n in Nudges(record, actor=SYSTEM).all() if f"round {row.n} is complete" in n.title], "the dispatcher is told once all are in"
