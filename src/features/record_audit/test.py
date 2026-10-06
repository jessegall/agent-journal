import time


from controllers.types import Facts, Questions, Reminders, Rules, Todos
from features.record_audit.audit import evidence
from resources.base import AGENT, USER
from tests.kit import nudges, tick
from tests.conftest import fresh


def test_evidence_finds_dead_paths_and_verbs_and_a_struck_claim_has_none(tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path))
    (tmp_path / ".codex").mkdir()
    (tmp_path / ".codex" / "config.toml").write_text('model = "gpt-6-sol"')
    record = fresh()
    project = record.root.parent
    (project / "src" / "v2").mkdir(parents=True)
    (project / "src" / "v2" / "serve.py").write_text("")
    pins = Facts(record, actor=AGENT)
    rules = Rules(record, actor=USER)
    pins.create("the server is v2/serve.py", keywords="word", brief="serve.py starts it; it moved under src/ and is still v2/serve.py")
    pins.create("the launcher was launch.py", keywords="word", brief="see old/launch.py for the relay")
    rules.create("close a row with `journal todo done`", keywords="word", brief="never with `journal frobnicate 4`")
    rules.create("journal disable must only run when the user asks", keywords="word")
    rules.create("A journal capability that fits in a few words is a feature", keywords="word")
    pins.create("the package is at the root", keywords="word", brief="the journal is copied into each project")
    Reminders(record, actor=USER).create("run tests/old.py first")
    assert [e.ref for e in evidence(record) if e.ref == "fact:1"] == [], \
        "nothing wrong with a claim whose file exists and whose verbs are known"
    found = evidence(record)
    assert [(e.ref, e.evidence) for e in found if e.ref == "fact:2"] == \
        [("fact:2", "names launch.py, which is gone"), ("fact:2", "names old/launch.py, which is gone")], \
        "a claim naming a file that is gone"
    assert [(e.evidence, e.retire) for e in found if e.ref == "rule:1"] == \
        [("names journal frobnicate, which the CLI does not answer to", 'journal rule 1 strike "<why>"')], \
        "a claim naming a verb the CLI lacks, with the command that retires it"
    assert [e.ref for e in found if e.ref in ("rule:2", "rule:3", "fact:3")] == [], \
        "top-level commands and ordinary journal prose are not evidence"
    assert [e.evidence for e in found if e.ref == "reminder:1"] == ["names tests/old.py, which is gone"], \
        "a reminder naming a missing file"
    pins.create("Codex runs on gpt-6-sol", keywords="word", brief="~/.codex/config.toml names it; ~/.codex/old.toml did once")
    assert [e.evidence for e in evidence(record) if e.ref == "fact:4"] == ["names ~/.codex/old.toml, which is gone"], \
        "a path under ~ is looked for in the home folder, not in the project"
    pins.complete(4, "struck")
    pins.complete(2, "struck")
    assert [e for e in evidence(record) if e.ref == "fact:2"] == [], "a struck claim has no evidence"

    todos = Todos(record, actor=USER)
    row = todos.create("stuck")
    q = Questions(record, actor=AGENT).create("which way", about=row.ref)
    assert [e for e in evidence(record) if e.ref == row.ref] == [], "a fresh question is not evidence"
    questions = Questions(record, actor=AGENT)
    old = questions.load(q.n)
    old.created = time.time() - 8 * 86400
    questions.path(q.n).write_text(old.dump())
    assert [e.evidence for e in evidence(record) if e.ref == row.ref] == ["waiting on the user for over 7 days (question 1)"], \
        "eight days waiting: evidence"

    tick(record)
    assert any(n.startswith("3 things in the record have evidence against them") for n in nudges(record)) is True, \
        "the first report says what has evidence, with the retiring commands under it"
