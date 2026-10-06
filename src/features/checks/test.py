import features
from controllers.types import Notifications
from features.checks.controller import Checks
from resources.base import SYSTEM, USER
from tests.conftest import fresh, refused


def open_notices(record):
    return [r.title for r in Notifications(record, actor=SYSTEM).rows.every() if not r.completed]


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
    filed = next(r for r in Notifications(record, actor=SYSTEM).rows.every() if r.title.startswith("The checker found"))
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
    assert checks.due(hourly.created + 60) == [], "a new check does not run the moment it is made"
    assert [c.n for c in checks.due(hourly.created + 3600)] == [hourly.n], "it runs a full interval after it was made"
    checks.run(hourly.n, wait=True)
    assert checks.due(checks.load(hourly.n).last["at"] + 60) == [], "it waits its minutes after a run"


def test_a_running_check_counts_its_steps_against_what_it_knows_of_the_total():
    from features.checks.output import progress
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
    from engine import runtime
    from engine.locks import claim
    from features.checks.controller import REPORTS
    from tests.conftest import fresh
    record = fresh()
    lock = runtime.folder(record.root) / REPORTS / "3.lock"
    first = claim(lock)
    assert (first is not None, claim(lock)) == (True, None), "a second engine finds the check already claimed and leaves it"
    first.close()
    assert claim(lock) is not None, "once the run ends, the check can be claimed again"


def test_touched_runs_the_tests_beside_what_changed_and_the_gate_commits_only_on_a_pass(monkeypatch):
    from controllers.types import Agents, Nudges
    from tests.kit import commit, git, project_on
    features.load()
    repo = project_on("work")
    (repo.project / "hooks").mkdir()
    commit(repo.project, "hooks/test.py", "def test(): pass\n")
    commit(repo.project, "hooks/code.py", "one\n")
    commit(repo.project, "old.txt", "gone soon\n")
    Agents(repo.record, actor=SYSTEM).create("claude-1")
    checks = Checks(repo.record, actor=USER)
    suite = checks.create("the suites pass", command="true", touched="echo ran {tests}")
    (repo.project / "hooks" / "code.py").write_text("two\n")
    (repo.project / "notes.txt").write_text("a note\n")
    said = checks.touched(suite.n)
    assert "ran hooks/test.py" in said and "no test covers notes.txt" in said, "the test beside a changed file runs, and what no test covers is named"
    spawned = []
    monkeypatch.setattr("features.checks.controller.subprocess.Popen", lambda args, **how: spawned.append((args, how)))
    checks.gate(suite.n, "change the hook", paths="hooks/code.py")
    args, how = spawned[0]
    assert args[-6:] == ["gate", str(suite.n), "change the hook", "--paths", "hooks/code.py", "--wait"] and how["start_new_session"], \
        "a gate runs in a process of its own, so a server restarted by another gate's install cannot cut it off"
    monkeypatch.undo()
    git(repo.project, "add", "notes.txt")
    git(repo.project, "rm", "-q", "old.txt")
    checks.gate(suite.n, "change the hook", paths="hooks/code.py,old.txt", wait=True)
    assert git(repo.project, "log", "-1", "--format=%s") == "change the hook" and "notes.txt" in git(repo.project, "status", "--short"), \
        "a pass commits exactly the named paths, never what else was staged"
    assert "old.txt" not in git(repo.project, "ls-files"), "a deleted path is committed as deleted, even when its removal was staged"
    assert any("passed and" in n.title for n in Nudges(repo.record, actor=SYSTEM).all()), "the agent is nudged it landed"
    checks.update(suite.n, command="false")
    (repo.project / "hooks" / "code.py").write_text("three\n")
    checks.gate(suite.n, "break the hook", paths="hooks/code.py", wait=True)
    assert git(repo.project, "log", "-1", "--format=%s") == "change the hook", "a failure commits nothing"
    assert any("failed, nothing was committed" in n.title for n in Nudges(repo.record, actor=SYSTEM).all()), "and the agent is nudged why"
    assert "name the paths" in refused(lambda: checks.gate(suite.n, "nothing named", paths=" ")), "a gate names the paths it commits"
    checks.update(suite.n, command="true", then="echo after")
    (repo.project / "hooks" / "code.py").write_text("four\n")
    checks.gate(suite.n, "then runs", paths="hooks/code.py", wait=True)
    assert any("then ran" in n.title for n in Nudges(repo.record, actor=SYSTEM).all()), "what a check runs after its commit is run and told"
    checks.gate(suite.n, "missing path", paths="nowhere.txt", wait=True)
    assert any("the commit failed" in n.title for n in Nudges(repo.record, actor=SYSTEM).all()), "a commit that git refuses is told, not hidden"
    bare = checks.create("no touched command", command="true")
    assert "names no command for touched tests" in refused(lambda: checks.touched(bare.n)), "touched needs the command that runs the tests beside what changed"
    assert "no test covers what changed" in checks.touched(suite.n), "with nothing changed no test is run and the full check stays the gate"
    monkeypatch.setattr(Checks, "in_background", lambda self, n: False)
    assert "is already running" in checks.run(suite.n), "a check that is running is not started again"
    monkeypatch.setattr(Checks, "in_background", lambda self, n: True)
    assert "is running; its result lands on the row" in checks.run(suite.n), "a check started on its own tells where its result lands"


def test_a_check_that_runs_out_of_time_says_so():
    record = fresh()
    check = Checks(record, actor=USER).create("Slow", command="echo started; sleep 5", timeout=1)
    last = Checks(record, actor=USER).run(check.n, wait=True).last
    assert (last["ok"], last["output"].splitlines()[0]) == (False, "started"), "the run fails and keeps what the command printed"
    assert "ran out of time: stopped after 1 seconds" in last["output"].splitlines()[-1], "its last line names the time limit, which the failure notice shows"


def test_a_failing_check_reaches_a_waiting_agent_and_is_told_again_only_when_it_changes():
    from controllers.types import Agents, Nudges, Works
    from resources.base import AGENT
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    works = Works(record, actor=AGENT)
    works.update(works.create("the long run").n, awaiting="the suite")
    (record.root.parent / "said").write_text("issue 5 waits\n")
    checks = Checks(record, actor=USER)
    check = checks.create("Every issue is answered", command="cat said; exit 1")
    nudged = lambda: [n.title for n in Nudges(record, actor=SYSTEM).rows.every() if n.title.startswith(f"check {check.n} failed")]
    checks.run(check.n, wait=True)
    assert nudged() == [f"check {check.n} failed - issue 5 waits"], "a failure reaches the agent while it waits on something else"
    checks.run(check.n, wait=True)
    assert len(nudged()) == 1 and len(open_notices(record)) == 1, "the same failure again is neither filed nor nudged twice"
    (record.root.parent / "said").write_text("issue 6 waits\n")
    checks.run(check.n, wait=True)
    assert nudged()[-1] == f"check {check.n} failed - issue 6 waits" and open_notices(record) == [f"check {check.n} failed - issue 6 waits"], \
        "a failure that reports something else is nudged again and replaces the one before"


def test_upgrades_rename_old_stored_keys_in_events_agents_checks_and_settings(tmp_path):
    import json
    from migrations.m0008_plain_stored_keys import run

    home = tmp_path / "environments" / "main"
    (home / "agent").mkdir(parents=True)
    (tmp_path / "project" / "check").mkdir(parents=True)
    (tmp_path / "check").mkdir()
    (home / "events.jsonl").write_text('{"heard": 1}\n')
    (home / "agent" / "001.md").write_text('{"said": "hello"}')
    (home / "agent" / "002.md").write_text('{"nothing": "to rename"}')
    (tmp_path / "project" / "check" / "001.md").write_text('{"said": "ok"}')
    (tmp_path / "check" / "001.md").write_text('{"said": "old"}')
    (home / "settings.json").write_text(json.dumps({"work_tracking": {"said_after": 5}}))
    other = tmp_path / "environments" / "other"
    other.mkdir()
    (other / "settings.json").write_text(json.dumps({"work_tracking": {"name_work_every": 5}, "x": 1}))
    assert run(tmp_path) == "1 event logs, 3 rows and 1 settings files use the plain key names", "every old key is renamed where it is stored"
    assert '"handled"' in (home / "events.jsonl").read_text() and '"last_message"' in (home / "agent" / "001.md").read_text(), "events and agents use the plain keys"
    assert '"output"' in (tmp_path / "project" / "check" / "001.md").read_text(), "a check row uses the plain key"
    assert json.loads((home / "settings.json").read_text()) == {"work_tracking": {"name_work_every": 5}}, "the setting is renamed"
    (other / "settings.json").write_text("{")
    assert run(tmp_path) == "0 event logs, 0 rows and 0 settings files use the plain key names", "a second run finds nothing, and an unreadable settings file is skipped"
