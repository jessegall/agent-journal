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
    assert [c.n for c in checks._due(10_000)] == [hourly.n]
    checks.run(hourly.n, wait=True)
    assert checks._due(checks.load(hourly.n).last["at"] + 60) == [], "it waits its minutes after a run"
