import json

from features.plans.controller import Plans  # noqa: E402
from controllers.types import Docs, Environments, Messages, Notifications, Facts, Questions, Reminders, Reports, Rules, Todos, Works
from engine.record import Record
from migrations import applied, names, run as migrate
from migrations.m0001_the_old_record import Migration


def test_the_old_record_is_migrated_into_v2_resources(tmp_path):
    root = tmp_path / ".journal"
    env = root / "environments" / "main"
    (env / "todo").mkdir(parents=True)
    (env / "pins").mkdir()
    (root / "rules").mkdir()
    (root / "docs" / "the-engine" / "files").mkdir(parents=True)
    (env / "todo" / "004-align-the-footer.md").write_text("---\ntitle: align the footer\nat: 2026-09-01T10:00:00+00:00\ndone: \nhow: \nblocked: after the release\npriority: 200\nafter: 2\n---\n\nwhy and where to start\n")
    (env / "todo" / "002-the-header.md").write_text("---\ntitle: the header\nat: 2026-09-01T09:00:00+00:00\ndone: 2026-09-02T09:00:00+00:00\nhow: shipped (abc1234)\n---\n\nthe brief\n")
    (env / "pins.json").write_text(json.dumps({"pins": [{"fact": "the hook payload carries the parent id", "at": "2026-09-01T10:00:00+00:00", "struck": None, "body": "001-x.md"}, {"fact": "an old one", "at": "2026-08-01T10:00:00+00:00", "struck": "no longer true"}]}))
    (env / "pins" / "001-x.md").write_text("measured on the first of the month\n")
    (env / "reminders.json").write_text(json.dumps({"reminders": [{"text": "run the suites first", "at": "2026-09-01T10:00:00+00:00", "until": "CI is green", "done": None}]}))
    (env / "inbox.json").write_text(json.dumps({"inbox": [{"text": "fix the header, and later the footer", "at": "2026-09-01T10:00:00+00:00", "parts": [{"excerpt": "fix the header", "became": ["work"]}, {"excerpt": "later the footer", "became": ["todo 4"]}], "processed": "2026-09-01T11:00:00+00:00", "replies": [{"text": "parked as 4"}]}]}))
    (env / "questions.json").write_text(json.dumps({"questions": [{"text": "which colour", "at": "2026-09-01T10:00:00+00:00", "links": ["todos:4", "inbox:1"], "description": "the header is grey", "options": [{"label": "blue", "description": "matches", "code": ""}], "pick": 1, "answer": "blue", "answered_at": "2026-09-01T12:00:00+00:00"}]}))
    (env / "work.json").write_text(json.dumps({"work": [{"subject": "the header", "at": "2026-09-01T10:00:00+00:00", "ended": None, "notes": [{"at": "2026-09-01T10:30:00+00:00", "text": "half way"}]}]}))
    (env / "plans.json").write_text(json.dumps({"plans": [{"title": "Everything", "goal": "all of it", "body": "phase by phase", "status": "active", "at": "2026-09-01T10:00:00+00:00", "phases": [{"title": "First", "when": "the first is done", "checkpoint": False, "todos": [2], "body": "b1"}, {"title": "Second", "when": "", "checkpoint": True, "todos": [4], "body": ""}]}]}))
    (env / "reports.json").write_text(json.dumps({"reports": [{"title": "what the reviewers found", "body": "findings", "at": "2026-09-01T10:00:00+00:00", "about": "todos:4", "archived": None}]}))
    (env / "notifications.json").write_text(json.dumps({"notifications": [{"text": "the migration is through", "at": "2026-09-01T10:00:00+00:00", "read_at": None}]}))
    (root / "record.json").write_text(json.dumps({"rules": [{"fact": "name the model", "at": "2026-09-01T10:00:00+00:00", "struck": None}, {"fact": "an old rule", "at": "2026-08-01T10:00:00+00:00", "struck": "repealed"}]}))
    (root / "rules" / "001-name-the-model.md").write_text("---\ntitle: name the model\nat: 2026-09-01T10:00:00+00:00\n---\nbecause the orchestrator's model is the expensive one\n")
    (root / "docs" / "the-engine" / "index.md").write_text("---\nn: 10\ntitle: The engine\nabstract: the loop\nstatus: draft\nat: 2026-09-01T10:00:00+00:00\n---\nFour parts.\n")
    (root / "docs" / "the-engine" / "01-the-pieces.md").write_text("---\ntitle: The pieces\n---\nsupervisor, driver\n")
    (root / "docs" / "the-engine" / "files" / "shot.png").write_bytes(b"png")

    Migration(root).run()
    record = Record(root, "main")
    todos = Todos(record)
    assert (sorted(todos.numbers()), bool(todos.load(2).completed), todos.load(2).outcome, todos.load(4).data["blocked"], todos.load(4).data["priority"], todos.load(4).refs) == \
        ([2, 4], True, "shipped (abc1234)", "after the release", 200, ["todo:2"]), \
        "to-dos keep their numbers, their state, their how, blocked, priority and after"
    pins = Facts(record)
    assert (pins.load(1).brief, bool(pins.load(2).completed), pins.load(2).outcome) == ("measured on the first of the month", True, "no longer true"), \
        "pins with their reasoning; a struck one is struck with its why"
    assert Reminders(record).load(1).data["until"] == "CI is green", "reminders with their until"
    m = Messages(record).load(1)
    assert (m.sections, bool(m.completed), [c.brief for c in Messages(record).comments(1)]) == \
        ([{"title": "fix the header", "body": "work"}, {"title": "later the footer", "body": "todo 4"}], True, ["parked as 4"]), \
        "messages with their parts and replies, processed"
    q = Questions(record).load(1)
    assert (q.data["options"][0]["title"], q.data["pick"], q.outcome, q.refs) == ("blue", 1, "blue", ["todo:4", "message:1"]), \
        "questions with options, the pick, the answer and their links in v2 words"
    assert (Works(record).load(1).sections, Works(record).load(1).completed) == \
        ([{"title": "2026-09-01T10:30:00", "body": "half way"}], 0.0), "work with its notes as sections, still open"
    p = Plans(record).load(1)
    assert (p.data["status"], p.data["current"], [ph["todos"] for ph in p.data["phases"]], p.refs) == \
        ("active", 2, [[2], [4]], ["todo:2", "todo:4"]), "plans with phases, status, the current phase derived from the rows, linked to them"
    assert (Reports(record).load(1).brief, Reports(record).load(1).refs) == ("findings", ["todo:4"]), \
        "reports with their body, linked to what they are about"
    assert Notifications(record).load(1).seen == ["system"], "notifications, unread"
    rules = Rules(record)
    assert (rules.load(1).brief, bool(rules.load(2).completed), rules.load(2).outcome) == \
        ("because the orchestrator's model is the expensive one", True, "repealed"), \
        "rules from the record, with the reasoning file where there is one; the struck one struck"
    docs = Docs(record)
    assert (docs.load(10).title, docs.load(10).abstract, docs.load(10).sections, docs.files(10)) == \
        ("The engine", "the loop", [{"title": "The pieces", "body": "supervisor, driver"}], ["shot.png"]), "docs keep their number, parts and files"
    assert [e.title for e in Environments(record).all()] == ["main"], "environments become resources"
    assert all(e.actor == "system" and e.data.get("migrated") for e in record.events() if e.action == "created" and e.type != "comment") is True, \
        "every migrated resource left one created event by the system, marked"
    assert Migration(root).run() == [], "a record already migrated is left alone"


def test_the_ledger_runs_every_migration_once_in_order(tmp_path):
    other = tmp_path / ".journal"
    legacy = Rules(Record(other, "main")).create("inject this", injected=True, injected_codex=False)
    ran = migrate(other)
    assert (ran, sorted(applied(other))) == (names(), names()), "a fresh record runs every migration once and writes the ledger"
    assert (Rules(Record(other, "main")).load(legacy.n).injected, "targets" in Rules(Record(other, "main")).load(legacy.n).data) == (True, False), \
        "the rule injection migration unifies old choices"
    assert migrate(other) == [], "run again: nothing"
    assert set(applied(other)["m0001_the_old_record"]) == {"at", "result"}, "the ledger says when and what came of it"
