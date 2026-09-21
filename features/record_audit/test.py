import time


from controllers.types import Facts, Questions, Reminders, Rules, Todos
from features.record_audit.audit import evidence
from features.memory_checkpoints.reread import owed as read_owed, standing
from resources.base import AGENT, USER
from tests.kit import nudges, report
from tests.conftest import fresh


def test_evidence_finds_dead_paths_and_verbs_and_a_struck_claim_has_none():
    record = fresh()
    project = record.root.parent
    (project / "v2").mkdir()
    (project / "v2" / "serve.py").write_text("")
    pins = Facts(record, actor=AGENT)
    rules = Rules(record, actor=USER)
    pins.create("the server is v2/serve.py")
    pins.create("the launcher was launch.py", brief="see old/launch.py for the relay")
    rules.create("close a row with `journal todo done`", brief="never with `journal frobnicate 4`")
    rules.create("journal disable must only run when the user asks")
    rules.create("A journal capability that fits in a few words is a feature")
    pins.create("the package is at the root", brief="the journal is copied into each project")
    Reminders(record, actor=USER).create("run tests/old.py first")
    assert [e["ref"] for e in evidence(record) if e["ref"] == "fact:1"] == [], \
        "nothing wrong with a claim whose file exists and whose verbs are known"
    found = evidence(record)
    assert [(e["ref"], e["evidence"]) for e in found if e["ref"] == "fact:2"] == \
        [("fact:2", "names launch.py, which is gone"), ("fact:2", "names old/launch.py, which is gone")], \
        "a claim naming a file that is gone"
    assert [(e["evidence"], e["retire"]) for e in found if e["ref"] == "rule:1"] == \
        [("names journal frobnicate, which the CLI does not answer to", 'journal rule 1 strike "<why>"')], \
        "a claim naming a verb the CLI lacks, with the command that retires it"
    assert [e["ref"] for e in found if e["ref"] in ("rule:2", "rule:3", "fact:3")] == [], \
        "top-level commands and ordinary journal prose are not evidence"
    assert [e["evidence"] for e in found if e["ref"] == "reminder:1"] == ["names tests/old.py, which is gone"], \
        "a reminder naming a missing file"
    pins.complete(2, "struck")
    assert [e for e in evidence(record) if e["ref"] == "fact:2"] == [], "a struck claim has no evidence"

    todos = Todos(record, actor=USER)
    row = todos.create("stuck")
    q = Questions(record, actor=AGENT).create("which way", about=row.ref)
    assert [e for e in evidence(record) if e["ref"] == row.ref] == [], "a fresh question is not evidence"
    questions = Questions(record, actor=AGENT)
    old = questions.load(q.n)
    old.created = time.time() - 8 * 86400
    questions.path(q.n).write_text(old.dump())
    assert [e["evidence"] for e in evidence(record) if e["ref"] == row.ref] == ["waiting on the user for over 7 days (question 1)"], \
        "eight days waiting: evidence"

    assert read_owed(record) is False, "a young record owes no reading pass yet"
    assert read_owed(record, days=0) is True, "a week after its first event, never read: owed"
    assert sorted(r.ref for r in standing(record)) == ["fact:1", "fact:3", "rule:1", "rule:2", "rule:3"], \
        "the reading pass is every standing rule and fact, in full"
    Rules(record, actor=AGENT).action("reread")()
    assert read_owed(record) is False, "read: no longer owed"

    report(record, "idle", "Stop")
    assert nudges(record)[0].startswith("3 things in the record have evidence against them") is True, \
        "the first report says what has evidence, with the retiring commands under it"
