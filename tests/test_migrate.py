import json
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Docs, Environments, Messages, Notifications, Pins, Plans, Questions, Reminders, Reports, Rules, Todos, Works  # noqa: E402
from engine.record import Record  # noqa: E402
from migrations import applied, names, run as migrate  # noqa: E402
from migrations.m0001_the_old_record import Migration  # noqa: E402
from tests.kit import check, done  # noqa: E402

root = Path(tempfile.mkdtemp()) / ".journal"
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

got = Migration(root).run()
record = Record(root, "main")
todos = Todos(record)
check("to-dos keep their numbers, their state, their how, blocked, priority and after", (sorted(todos.numbers()), bool(todos.load(2).completed), todos.load(2).outcome, todos.load(4).data["blocked"], todos.load(4).data["priority"], todos.load(4).refs),
      ([2, 4], True, "shipped (abc1234)", "after the release", 200, ["todo:2"]))
pins = Pins(record)
check("pins with their reasoning; a struck one is struck with its why", (pins.load(1).brief, bool(pins.load(2).completed), pins.load(2).outcome), ("measured on the first of the month", True, "no longer true"))
check("reminders with their until", Reminders(record).load(1).data["until"], "CI is green")
m = Messages(record).load(1)
check("messages with their parts and replies, processed", (m.sections, bool(m.completed), [c.brief for c in Messages(record).comments(1)]), ([{"title": "fix the header", "body": "work"}, {"title": "later the footer", "body": "todo 4"}], True, ["parked as 4"]))
q = Questions(record).load(1)
check("questions with options, the pick, the answer and their links in v2 words", (q.data["options"][0]["title"], q.data["pick"], q.outcome, q.refs), ("blue", 1, "blue", ["todo:4", "message:1"]))
check("work with its notes as sections, still open", (Works(record).load(1).sections, Works(record).load(1).completed), ([{"title": "2026-09-01T10:30:00", "body": "half way"}], 0.0))
p = Plans(record).load(1)
check("plans with phases, status, the current phase derived from the rows, linked to them", (p.data["status"], p.data["current"], [ph["todos"] for ph in p.data["phases"]], p.refs), ("active", 2, [[2], [4]], ["todo:2", "todo:4"]))
check("reports with their body, linked to what they are about", (Reports(record).load(1).brief, Reports(record).load(1).refs), ("findings", ["todo:4"]))
check("notifications, unread", Notifications(record).load(1).seen, ["system"])
rules = Rules(record)
check("rules from the record, with the reasoning file where there is one; the struck one struck", (rules.load(1).brief, bool(rules.load(2).completed), rules.load(2).outcome), ("because the orchestrator's model is the expensive one", True, "repealed"))
docs = Docs(record)
check("docs keep their number, parts and files", (docs.load(10).title, docs.load(10).abstract, docs.load(10).sections, docs.files(10)), ("The engine", "the loop", [{"title": "The pieces", "body": "supervisor, driver"}], ["shot.png"]))
check("environments become resources", [e.title for e in Environments(record).all()], ["main"])
check("every migrated resource left one created event by the system, marked", all(e.actor == "system" and e.data.get("migrated") for e in record.events() if e.action == "created" and e.type != "comment"), True)
again = Migration(root).run()
check("a record already migrated is left alone", again, [])

# THE LEDGER: every migration runs once, in order, and the record says which ran
other = Path(tempfile.mkdtemp()) / ".journal"
legacy = Rules(Record(other, "main")).create("inject this", injected=True, injected_codex=False)
ran = migrate(other)
check("a fresh record runs every migration once and writes the ledger", (ran, sorted(applied(other))), (names(), names()))
check("the rule injection migration unifies old choices", (Rules(Record(other, "main")).load(legacy.n).injected, "targets" in Rules(Record(other, "main")).load(legacy.n).data), (True, False))
check("run again: nothing", migrate(other), [])
check("the ledger says when and what came of it", set(applied(other)["m0001_the_old_record"]), {"at", "result"})

done()
