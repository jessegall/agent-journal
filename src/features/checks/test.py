import features
from controllers.types import Notifications
from features.checks.controller import Checks
from resources.base import SYSTEM, USER
from tests.conftest import fresh, refused


def open_notices(record):
    return [r.title for r in Notifications(record, actor=SYSTEM)._every() if not r.completed]


def test_a_check_runs_its_command_and_a_failure_is_filed_until_it_passes():
    features.load()
    record = fresh()
    checks = Checks(record, actor=USER)
    check = checks.create("The marker file exists", command="test -f marker")
    assert check.data["buttons"][0]["action"] == "run", "a check carries its own Run button"
    ran = checks.run(check.n, wait=True)
    assert ran.last["ok"] is False and ran.last["code"] == 1, ran.last
    assert open_notices(record) == [f"check {check.n} failed - The marker file exists"], open_notices(record)
    (record.root.parent / "marker").write_text("")
    assert checks.run(check.n, wait=True).last["ok"] is True
    assert open_notices(record) == [], "a pass clears the failure it filed"
    worded = Checks(record, actor=USER).create("Sins", command="echo '3 sins across 1 skill.'; exit 1", failure="The checker found {summary}")
    Checks(record, actor=USER).run(worded.n, wait=True)
    assert "The checker found 3 sins across 1 skill." in open_notices(record), "a check says in its own words what failed, with its last line"
    filed = next(r for r in Notifications(record, actor=SYSTEM)._every() if r.title.startswith("The checker found"))
    assert filed.data["label"] == "Check failed", "and the activity list heads it as a failed check, not as a notification"


def test_a_check_without_a_command_refuses_in_words():
    features.load()
    record = fresh()
    checks = Checks(record, actor=USER)
    check = checks.create("Nothing to run")
    assert "has no command" in refused(lambda: checks.run(check.n, wait=True))


def test_only_the_checks_that_are_due_come_up_on_the_timer():
    features.load()
    record = fresh()
    checks = Checks(record, actor=USER)
    hourly = checks.create("Hourly", command="true", every=60)
    checks.create("By hand", command="true")
    assert checks._due(hourly.created + 60) == [], "a new check does not run the moment it is made"
    assert [c.n for c in checks._due(hourly.created + 3600)] == [hourly.n], "it runs a full interval after it was made"
    checks.run(hourly.n, wait=True)
    assert checks._due(checks.load(hourly.n).last["at"] + 60) == [], "it waits its minutes after a run"


def test_a_running_check_counts_its_steps_against_what_it_knows_of_the_total():
    from features.checks.controller import progress
    assert progress("building 12/40 files") == {"done": 12, "total": 40, "percent": 30.0}, "an explicit count"
    assert progress("collected 10 items\n\n.....F.") == {"done": 7, "total": 10, "percent": 70.0}, "one mark per test against the collected count"
    assert progress("bringing up nodes...\n\n" + "." * 30, 60) == {"done": 30, "total": 60, "percent": 50.0}, "the last run's count when none is printed"
    assert progress("downloading 45%") == {"percent": 45}, "a printed percentage"
    assert progress("working") == {"percent": None}, "nothing to count: the viewer estimates from time"


def test_a_check_can_leave_a_report_of_findings_that_is_kept_with_its_run():
    record = fresh()
    report = '{"title": "Sins", "summary": "1 sin", "findings": [{"name": "python-dict-bag", "file": "src/x.py", "line": "12", "group": "python/value-objects", "text": "A dict read by keys"}, "junk"]}'
    check = Checks(record, actor=USER).create("Sins", command=f"printf '%s' '{report}' > \"$JOURNAL_REPORT\"; exit 1")
    last = Checks(record, actor=USER).run(check.n, wait=True).last
    assert (last["ok"], last["report"]["summary"], list(last["report"]["findings"])) == (False, "1 sin", [
        {"name": "python-dict-bag", "file": "src/x.py", "line": 12, "where": "", "text": "A dict read by keys", "group": "python/value-objects"}]), \
        "the report written to $JOURNAL_REPORT is read into typed findings and kept with the run"
    plain = Checks(record, actor=USER).create("Plain", command="true")
    assert Checks(record, actor=USER).run(plain.n, wait=True).last["report"] is None, "a check that writes no report has none"


def test_a_due_check_runs_in_one_engine_while_another_holds_it():
    from features.checks.handlers import claim
    from tests.conftest import fresh
    record = fresh()
    first = claim(record.root, 3)
    assert (first is not None, claim(record.root, 3)) == (True, None), "a second engine finds the check already claimed and leaves it"
    first.close()
    assert claim(record.root, 3) is not None, "once the run ends, the check can be claimed again"
