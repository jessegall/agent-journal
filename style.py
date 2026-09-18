from __future__ import annotations

import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

from templates import render

DIR = "style"
FILE = "item.md"
STRUCK = "struck"
FIELDS = ("subject", "title", "decision", "when", "at", "source")
PREFIX = "style-"
MARKER = ".generated-by-agent-journal"
BRIEFED = ("AGENTS.md", "CLAUDE.md")
BEGIN = "<!-- BEGIN: agent-journal style (auto-generated, run `journal style sync`) -->"
END = "<!-- END: agent-journal style -->"

MESSAGES = {
    "needs_subject": 'a rule needs a short subject name: journal style add naming "<what it covers>" --decision="…" --when="…"',
    "needs_title": "a rule needs its title: what the subject covers, in a few words",
    "needs_decision": 'a rule needs its decision, the way this project does it: --decision="<the rule>"',
    "needs_when": 'a rule needs to say when it applies, which is what loads its skill: --when="Use it when …"',
    "exists": "there is already a rule for {name}; `journal style set {name} decision \"…\"` changes it",
    "no_such": "there is no coding style rule {name}; `journal style` lists them",
    "added": "coding style rule {name}: {title}\n  its skill is {skill}; `journal style show {name}` reads it",
    "not_a_field": "{field} is not a field you can set; set title, decision or when",
    "field_set": "rule {name}: {field} is now {value}",
    "needs_why": 'say why the rule no longer holds: journal style remove {name} "<why>"',
    "removed": "rule {name} is retired: {why}\n  kept at {path}; its skill is gone",
    "struck_note": "\n\n## Retired {at}\n\n{why}\n",
    "empty": "No coding style rules yet. An agent asked for a coding style review files them: "
             'journal style add <subject> "<title>" --decision="…" --when="…" --brief',
    "row": "{subject}  {title}",
    "row_facts": "{decision}",
    "synced_skill": "  + skill {name} written",
    "dropped_skill": "  - skill {name} removed: its rule is gone",
    "briefed": "  + {file}: the coding style list is up to date",
    "sync_current": "  = coding style skills already current",
    "show": "RULE {subject}  {title}\n\n  decision: {decision}\n  loads when: {when}\n  skill: {skill}\n\n{body}",
    "block_heading": "## Coding style",
    "block_lead": "This project's coding style, one skill per subject. Load a subject's skill before writing or reviewing "
                  "code it covers; `journal style` lists them.",
    "block_row": "- **`{skill}`** — {title}: {decision}",
    "skill_rule": "**The rule here:** {decision}",
    "skill_examples": "Worked examples are in \\[reference/examples.md\\](reference/examples.md).",
    "examples_head": "# {title} — examples",
    "no_examples": "No examples were recorded for this rule yet.",
    "marker": "Generated from .journal/style/{subject}/item.md by `journal style sync`. Edit the rule, not this folder.\n",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def folder(root: Path) -> Path:
    return root / DIR


def _slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")[:40].rstrip("-")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _one_line(text: str) -> str:
    return " ".join((text or "").split())


def _parse(path: Path) -> tuple[dict, str]:
    text = path.read_text()
    meta: dict = {}
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            for line in text[4:end].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    return meta, text


def _write(path: Path, meta: dict, body: str) -> None:
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in FIELDS] + ["---", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + (body.strip() + "\n" if body.strip() else ""))


def all_items(root: Path) -> list[dict]:
    d = folder(root)
    if not d.is_dir():
        return []
    out = []
    for f in sorted(d.iterdir()):
        if f.is_dir() and f.name != STRUCK and (f / FILE).is_file():
            meta, body = _parse(f / FILE)
            out.append({**{k: meta.get(k, "") for k in FIELDS}, "subject": meta.get("subject") or f.name,
                        "body": body, "dir": f, "path": f / FILE})
    return out


def get(root: Path, subject: str) -> tuple[dict | None, str]:
    subject = _slug(subject)
    item = next((x for x in all_items(root) if x["subject"] == subject), None)
    return (item, "") if item else (None, say("no_such", name=repr(subject)))


def add(root: Path, subject: str, title: str, decision: str, when: str, body: str, source: str = "the agent") -> tuple[bool, str]:
    subject, title, decision, when = _slug(subject), _one_line(title), _one_line(decision), _one_line(when)
    for value, key in ((subject, "needs_subject"), (title, "needs_title"), (decision, "needs_decision"), (when, "needs_when")):
        if not value:
            return False, say(key)
    if get(root, subject)[0] is not None:
        return False, say("exists", name=subject)
    meta = {"subject": subject, "title": title, "decision": decision, "when": when, "at": _now(), "source": source}
    _write(folder(root) / subject / FILE, meta, body or "")
    return True, say("added", name=subject, title=title, skill=PREFIX + subject)


def set_field(root: Path, subject: str, field: str, value: str) -> tuple[bool, str]:
    if field not in ("title", "decision", "when"):
        return False, say("not_a_field", field=repr(field))
    value = _one_line(value)
    if not value:
        return False, say({"title": "needs_title", "decision": "needs_decision", "when": "needs_when"}[field])
    item, err = get(root, subject)
    if item is None:
        return False, err
    meta = {k: item.get(k, "") for k in FIELDS}
    meta[field] = value
    _write(item["path"], meta, item["body"])
    return True, say("field_set", name=item["subject"], field=field, value=repr(value))


def remove(root: Path, subject: str, why: str) -> tuple[bool, str]:
    why = _one_line(why)
    item, err = get(root, subject)
    if item is None:
        return False, err
    if not why:
        return False, say("needs_why", name=item["subject"])
    struck = folder(root) / STRUCK
    struck.mkdir(exist_ok=True)
    dst = struck / item["subject"]
    if dst.exists():
        dst = struck / f"{item['subject']}-{_now()[:19].replace(':', '')}"
    meta = {k: item.get(k, "") for k in FIELDS}
    _write(item["path"], meta, item["body"] + say("struck_note", at=_now()[:19], why=why))
    item["dir"].rename(dst)
    return True, say("removed", name=item["subject"], why=why, path=dst.relative_to(root.parent))


def sections(body: str) -> dict[str, str]:
    out: dict[str, list[str]] = {}
    current = ""
    for line in (body or "").splitlines():
        m = re.match(r"^##\s+(.+?)\s*$", line)
        if m:
            current = m.group(1).strip().lower()
            out.setdefault(current, [])
        elif current:
            out[current].append(line)
    return {k: "\n".join(v).strip() for k, v in out.items()}


def triggers(body: str) -> list[str]:
    return [line.strip()[2:].strip() for line in sections(body).get("triggers", "").splitlines() if line.strip().startswith("- ")]


def _description(item: dict) -> str:
    text = f"Use when {item['when'].rstrip('.')}. This project's rule: {item['decision']}"
    return text.replace('"', "'").replace("<", "").replace(">", "")[:1024]


def skill_files(item: dict) -> dict[str, str]:
    name, parts = PREFIX + item["subject"], sections(item["body"])
    why = parts.get("why", "")
    skill = [f'---\nname: {name}\ndescription: "{_description(item)}"\n---', "", f"# {item['title']}", "",
             say("skill_rule", decision=item["decision"]), ""]
    if why:
        skill += [why, ""]
    skill.append(say("skill_examples"))
    examples = [say("examples_head", title=item["title"]), "", parts.get("examples") or say("no_examples")]
    return {"SKILL.md": "\n".join(skill) + "\n",
            "reference/examples.md": "\n".join(examples) + "\n",
            "evals/triggers.json": json.dumps({"triggers": triggers(item["body"]), "not": []}, indent=2) + "\n",
            MARKER: say("marker", subject=item["subject"])}


def _block(items: list[dict]) -> str:
    rows = [say("block_row", skill=PREFIX + i["subject"], title=i["title"], decision=i["decision"]) for i in items]
    return "\n".join([BEGIN, "", say("block_heading"), "", say("block_lead"), "", *rows, "", END])


def _brief(project: Path, items: list[dict]) -> list[str]:
    out = []
    for name in BRIEFED:
        f = project / name
        if not f.is_file():
            continue
        had = f.read_text()
        block = _block(items) if items else ""
        if BEGIN in had and END in had:
            head, _, rest = had.partition(BEGIN)
            _, _, tail = rest.partition(END)
            want = head.rstrip("\n") + ("\n\n" + block if block else "") + "\n" + tail.lstrip("\n")
            want = want if want.strip() else ""
        elif block:
            want = had.rstrip() + "\n\n" + block + "\n"
        else:
            continue
        if want != had:
            f.write_text(want)
            out.append(say("briefed", file=name))
    return out


def sync(root: Path, project: Path) -> list[str]:
    items = all_items(root)
    base = project / ".claude" / "skills"
    out, wanted = [], set()
    for item in items:
        name = PREFIX + item["subject"]
        wanted.add(name)
        changed = False
        for rel, text in skill_files(item).items():
            f = base / name / rel
            if not f.is_file() or f.read_text() != text:
                f.parent.mkdir(parents=True, exist_ok=True)
                f.write_text(text)
                changed = True
        if changed:
            out.append(say("synced_skill", name=name))
    if base.is_dir():
        # only folders this generator wrote: a hand-written style-something skill is never touched
        for d in sorted(base.glob(PREFIX + "*")):
            if d.is_dir() and d.name not in wanted and (d / MARKER).is_file():
                shutil.rmtree(d)
                out.append(say("dropped_skill", name=d.name))
    out += _brief(project, items)
    return out or [say("sync_current")]


def row(n: int, item: dict) -> dict:
    return {"n": n, "subject": item["subject"], "title": item["title"], "decision": item["decision"],
            "when": item["when"], "at": item.get("at", ""), "skill": PREFIX + item["subject"]}


def detail(root: Path, n: int, item: dict) -> dict:
    return {**row(n, item), "body": item.get("body", ""), "sections": sections(item.get("body", "")),
            "triggers": triggers(item.get("body", ""))}


def render_rows(rows: list[dict]) -> str:
    return "\n".join(say("row", subject=r["subject"], title=r["title"]) + "\n    " + say("row_facts", decision=r["decision"]) for r in rows)


def show_text(d: dict) -> str:
    return say("show", subject=d["subject"], title=d["title"], decision=d["decision"], when=d["when"], skill=d["skill"],
               body=d.get("body", "").strip())
