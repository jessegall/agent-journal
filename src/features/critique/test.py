from pathlib import Path

import features
from features.critique.controller import Critiques
from resources.base import AGENT
from tests.conftest import fresh, refused


def test_a_round_hands_out_one_read_only_critic_per_lens_and_a_report_for_their_findings(monkeypatch):
    features.load()
    up = {"answers": False}
    monkeypatch.setattr("features.critique.controller.answers", lambda url: up["answers"])
    record = fresh()
    critiques = Critiques(record, actor=AGENT)
    assert "name the app" in refused(lambda: critiques.round("the helper list")), "a round needs the app's address first"
    record.set_setting("critique", {"app": "http://127.0.0.1:8611/p/", "login": "/tmp/state.json", "browsers": "/tmp/pw"})
    assert "does not answer" in refused(lambda: critiques.round("the helper list")), "an app that does not answer is refused in words"
    up["answers"] = True
    assert "no lens colour" in refused(lambda: critiques.round("the helper list", lenses="words,colour")), "an unknown lens is named with the list"
    said = critiques.round("the helper list", lenses="first-time,words")
    row = critiques.all()[0]
    assert ([c["lens"] for c in row.critics], "read-only subagent per lens" in said, f"journal report section {row.report}" in said) == \
        (["first-time", "words"], True, True), "one critic per lens, dispatched by the agent as a subagent, its findings filed in the round's report"
    briefs = [Path(c["brief"]).read_text() for c in row.critics]
    assert all("round.md" in b and "Your findings are your answer" in b and "journal" not in b.split("round.md")[1] for b in briefs), \
        "each brief names the round's page and asks for findings as the answer, with no journal command"
    assert "continue each subagent" in critiques.recheck(row.n, "the empty state has a line now"), "a recheck goes back to the same critics"
    critiques.complete(row.n)
    assert critiques.load(row.n).completed > 0, "finishing closes the round"
