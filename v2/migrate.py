import json
import re
import shutil
import time
from datetime import datetime
from pathlib import Path

from v2.controllers.types import CONTROLLERS
from v2.engine.record import Record
from v2.resources.base import AGENT, SYSTEM, USER, TITLE_MAX, titled

FRONT = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.DOTALL)


def when(text) -> float:
    try:
        return datetime.fromisoformat(str(text).replace("Z", "+00:00")).timestamp()
    except (TypeError, ValueError):
        return 0.0


def front(path: Path) -> tuple[dict, str]:
    m = FRONT.match(path.read_text())
    if not m:
        return {}, path.read_text()
    fields = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fields[k.strip()] = v.strip()
    return fields, m.group(2).strip()


def load_json(path: Path, key: str):
    try:
        got = json.loads(path.read_text())
    except (OSError, ValueError):
        return [] if key else {}
    return got.get(key, []) if key else got


class Migration:
    def __init__(self, root: Path):
        self.root = Path(root)
        self.done: list[str] = []

    def write(self, record: Record, type_: str, n: int, title: str, brief: str = "", abstract: str = "", actor: str = USER,
              created: float = 0.0, completed: float = 0.0, outcome: str = "", sections=(), refs=(), **data) -> None:
        c = CONTROLLERS[type_](record, actor=SYSTEM)
        r = c.resource(n=n, title=titled(title.strip().split('\n')[0]), abstract=abstract[:200], brief=brief, sections=list(sections), refs=list(refs),
                       seen=[actor], data={k: v for k, v in data.items() if v not in (None, "", [])},
                       created=created or time.time(), updated=created or time.time(), completed=completed, outcome=outcome)
        c.path(n).write_text(r.dump())
        record.emit(type_, n, "created", SYSTEM, migrated=True)
        self.done.append(f"{record.env}/{type_}:{n}")

    def fresh(self, record: Record, type_: str) -> bool:
        return not CONTROLLERS[type_](record, actor=SYSTEM).numbers()

    def environments(self) -> list[str]:
        home = self.root / "environments"
        return sorted(p.name for p in home.iterdir() if p.is_dir()) if home.is_dir() else []

    def run(self) -> list[str]:
        for env in self.environments():
            record = Record(self.root, env)
            self.environment(record)
        self.project(Record(self.root, self.environments()[0] if self.environments() else "main"))
        return self.done

    def environment(self, record: Record) -> None:
        home = record.home
        if self.fresh(record, "todo"):
            for f in sorted(home.glob("todo/[0-9][0-9][0-9]-*.md")):
                fields, body = front(f)
                self.write(record, "todo", int(f.name[:3]), fields.get("title", body), brief=body, created=when(fields.get("at")),
                           completed=when(fields.get("done")), outcome=fields.get("how", ""), blocked=fields.get("blocked", ""),
                           priority=int(fields["priority"]) if fields.get("priority", "").isdigit() else None,
                           refs=[f"todo:{n}" for n in re.findall(r"\d+", fields.get("after", ""))])
        if self.fresh(record, "pin"):
            for i, p in enumerate(load_json(home / "pins.json", "pins"), 1):
                body = (home / "pins" / p["body"]).read_text().strip() if p.get("body") and (home / "pins" / p["body"]).is_file() else ""
                self.write(record, "pin", i, p["fact"], brief=body, actor=AGENT, created=when(p.get("at")), completed=when(p.get("struck_at")) or (time.time() if p.get("struck") else 0.0), outcome=p.get("struck") or "")
        if self.fresh(record, "reminder"):
            for i, r in enumerate(load_json(home / "reminders.json", "reminders"), 1):
                self.write(record, "reminder", i, r["text"], created=when(r.get("at")), completed=when(r.get("done")), until=r.get("until", ""))
        if self.fresh(record, "message"):
            for i, m in enumerate(load_json(home / "inbox.json", "inbox"), 1):
                parts = [{"title": p.get("excerpt", "")[:TITLE_MAX], "body": ", ".join(p.get("became", []) if isinstance(p.get("became"), list) else [str(p.get("became", ""))])} for p in m.get("parts", [])]
                self.write(record, "message", i, m["text"], brief=m["text"], created=when(m.get("at")), completed=when(m.get("processed")), sections=parts, kind=m.get("kind", ""))
                for reply in m.get("replies", []):
                    CONTROLLERS["message"](record, actor=AGENT).comment(i, reply.get("text", ""))
        if self.fresh(record, "question"):
            for i, q in enumerate(load_json(home / "questions.json", "questions"), 1):
                options = [{"title": o.get("label", ""), "description": o.get("description", ""), "code": o.get("code", "")} for o in q.get("options", [])]
                refs = [l.replace("inbox:", "message:").replace("todos:", "todo:") for l in q.get("links", [])]
                self.write(record, "question", i, q["text"], abstract=q.get("description", ""), actor=AGENT, created=when(q.get("at")), completed=when(q.get("answered_at")),
                           outcome=q.get("answer") or "", options=options, pick=q.get("pick"), refs=refs)
        if self.fresh(record, "work"):
            for i, w in enumerate(load_json(home / "work.json", "work"), 1):
                notes = [{"title": n.get("at", "")[:19], "body": n.get("text", "")} for n in w.get("notes", [])]
                self.write(record, "work", i, w["subject"], actor=AGENT, created=when(w.get("at")), completed=when(w.get("ended")), sections=notes)
        if self.fresh(record, "plan"):
            for i, p in enumerate(load_json(home / "plans.json", "plans"), 1):
                phases = [{"title": ph["title"][:TITLE_MAX], "when": ph.get("when", "")[:TITLE_MAX], "checkpoint": bool(ph.get("checkpoint")), "brief": ph.get("body", ""), "todos": list(ph.get("todos", []))} for ph in p.get("phases", [])]
                status = {"draft": "draft", "ready": "ready", "active": "active", "waiting": "waiting", "done": "done", "abandoned": "abandoned"}.get(p.get("status", "draft"), "draft")
                current = next((k + 1 for k, ph in enumerate(phases) if not ph["todos"] or not all(self.closed(record, n) for n in ph["todos"])), len(phases) or 1)
                self.write(record, "plan", i, p["title"], brief=p.get("body", ""), actor=AGENT, created=when(p.get("at")), goal=p.get("goal", ""), phases=phases, status=status, current=current,
                           refs=[f"todo:{n}" for ph in phases for n in ph["todos"]])
        if self.fresh(record, "notification"):
            for i, n in enumerate(load_json(home / "notifications.json", "notifications"), 1):
                self.write(record, "notification", i, n["text"], actor=SYSTEM, created=when(n.get("at")))
                if n.get("read_at"):
                    CONTROLLERS["notification"](record, actor=USER).see(i)

    def closed(self, record: Record, n: int) -> bool:
        try:
            return bool(CONTROLLERS["todo"](record, actor=SYSTEM).load(n).completed)
        except Exception:
            return True

    def project(self, record: Record) -> None:
        if self.fresh(record, "rule"):
            for f in sorted(self.root.glob("rules/[0-9][0-9][0-9]-*.md")):
                fields, body = front(f)
                rules = load_json(self.root / "record.json", "rules")
                n = int(f.name[:3])
                fact = rules[n - 1]["fact"] if n - 1 < len(rules) else fields.get("title", body)
                self.write(record, "rule", n, fact, brief=body, created=when(fields.get("at")), completed=time.time() if (n - 1 < len(rules) and rules[n - 1].get("struck")) else 0.0)
            for i, r in enumerate(load_json(self.root / "record.json", "rules"), 1):
                if not CONTROLLERS["rule"](record, actor=SYSTEM).path(i).is_file():
                    self.write(record, "rule", i, r["fact"], created=when(r.get("at")), completed=time.time() if r.get("struck") else 0.0, outcome=r.get("struck") or "")
        if self.fresh(record, "doc"):
            for folder in sorted(p for p in (self.root / "docs").iterdir() if p.is_dir()) if (self.root / "docs").is_dir() else []:
                index = folder / "index.md"
                if not index.is_file():
                    continue
                fields, body = front(index)
                n = int(fields.get("n") or 0)
                if not n:
                    continue
                parts = []
                for part in sorted(folder.glob("[0-9][0-9]-*.md")):
                    pf, pb = front(part)
                    parts.append({"title": pf.get("title", part.stem[3:]), "body": pb})
                self.write(record, "doc", n, fields.get("title", body), abstract=fields.get("abstract", ""), brief=body, actor=AGENT, created=when(fields.get("at")),
                           completed=time.time() if fields.get("status") == "final" else 0.0, sections=parts)
                if (folder / "files").is_dir():
                    shutil.copytree(folder / "files", CONTROLLERS["doc"](record, actor=SYSTEM).folder(n), dirs_exist_ok=True)
        if self.fresh(record, "environment"):
            for i, name in enumerate(self.environments(), 1):
                self.write(record, "environment", i, name)


def migrate(root: Path) -> list[str]:
    return Migration(root).run()
