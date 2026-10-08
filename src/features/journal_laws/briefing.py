import re
import install
from dataclasses import dataclass
from pathlib import Path

from controllers.types import Rules
from engine.stored import write_text
from engine.wording import digest
from features.journal_laws.laws import carry, laws
from features.nudges.sending import Sent
from providers import PROVIDERS
from resources.base import SYSTEM

BAND = 4096


@dataclass(frozen=True)
class Markers:
    begin: str
    end: str

    @property
    def pattern(self) -> re.Pattern:
        return re.compile(rf"{re.escape(self.begin)}.*?{re.escape(self.end)}", re.DOTALL)

    def lone(self, text: str) -> str:
        found = [marker for marker in (self.begin, self.end) if marker in text]
        return found[0] if len(found) == 1 else ""


@dataclass(frozen=True)
class Briefing:
    written: tuple[Path, ...] = ()
    left: tuple[str, ...] = ()


FORM = 2
BEGIN = f"<!-- BEGIN: agent-journal, form {FORM} (auto-generated, run `journal upgrade`) -->"
END = f"<!-- END: agent-journal, form {FORM} -->"
CURRENT = re.compile(r"<!-- BEGIN: agent-journal, form (\d+) [^\n]*-->.*?<!-- END: agent-journal, form \1 -->", re.DOTALL)
CONFLICTED = re.compile(r"^(<{7}|>{7}) ", re.MULTILINE)
BOM = "\ufeff"
CURRENT_MARKERS = Markers("<!-- BEGIN: agent-journal, form", "<!-- END: agent-journal, form")
RETIRED = (
    Markers("<!-- BEGIN: agent-journal (auto-generated, run `journal update`) -->", "<!-- END: agent-journal -->"),
    Markers("<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->", "<!-- END: agent-journal law -->"),
    Markers("<!-- journal rules -->", "<!-- /journal rules -->"),
)
PRECEDENCE = ("The journal's lines come first on how you report, how you carry on and what you say in the chat. "
              "This file's own safety and deploy rules still stand. The user's own word comes before both.")


def briefing_files() -> list[str]:
    return sorted({cls.briefing_file for cls in PROVIDERS.values() if cls.briefing_file})


def block(record=None, rules: tuple[str, ...] = ()) -> str:
    out = [BEGIN, "", "## Where the journal comes first", "", PRECEDENCE, "", "## The journal's law", "",
           "These rules ship with the journal and cannot be switched off.", ""]
    for law in laws(record):
        out.extend((f"**{law.name} — {law.text}**", "", law.reason, ""))
    if rules:
        out.extend(("## Rules", "", *(f"- {rule}" for rule in rules), ""))
    return "\n".join((*out, END))


def injected(record) -> tuple[str, ...]:
    return tuple(rule.title for rule in Rules(record, actor=SYSTEM).rows.standing() if rule.injected)


def brief(project: Path, record) -> Briefing:
    managed = block(record, injected(record))
    title = project.resolve().name
    written, left = [], []
    for name in briefing_files():
        target = (project / name).resolve()
        try:
            had = target.read_bytes().decode() if target.is_file() else ""
        except UnicodeDecodeError:
            left.append(f"{name} left as it is: it is not UTF-8 text")
            continue
        mark, had = (BOM, had[1:]) if had.startswith(BOM) else ("", had)
        why = untouchable(had)
        if why:
            left.append(f"{name} left as it is: {why}")
            continue
        want = leading(had, managed) if had.strip() else f"# {title}\n\n{managed}\n"
        if want != had:
            held = install.remembered_unchanged(project, record.root, project / name) if target.is_file() else False
            write_text(target, mark + want)
            if held:
                install.remember_rewritten(project, record.root, project / name)
            written.append(project / name)
    return Briefing(tuple(written), tuple(left))


def instructions_hash(project: Path, record) -> str:
    texts = [CURRENT.sub("", (project / name).read_bytes().decode(errors="replace")) for name in briefing_files() if (project / name).is_file()]
    return digest("\0".join((*texts, *injected(record), carry(record)))) if texts else ""


def untouchable(text: str) -> str:
    if CONFLICTED.search(text):
        return "it has merge conflict markers"
    newer = [int(found.group(1)) for found in CURRENT.finditer(text) if int(found.group(1)) > FORM]
    if newer:
        return f"its journal block is form {max(newer)}, newer than this journal's form {FORM}"
    lone = next((marker for marker in (markers.lone(text) for markers in (CURRENT_MARKERS, *RETIRED)) if marker), "")
    return f"it has {lone} without its other marker" if lone else ""


def leading(had: str, managed: str) -> str:
    newline = "\r\n" if "\r\n" in had else "\n"
    managed = managed.replace("\n", newline)
    rest = had
    for retired in RETIRED:
        rest = retired.pattern.sub("", rest)
    found = CURRENT.search(rest)
    if found:
        return rest[:found.start()] + managed + rest[found.end():]
    if not rest.startswith("# "):
        return f"{managed}{newline}{newline}{rest}"
    head, _, after = rest.partition(newline)
    separator = newline if after.startswith(newline) else newline + newline
    return f"{head}{newline}{newline}{managed}{separator}{after}"


def long_briefings(context, agent) -> list[Sent]:
    cls, project = PROVIDERS.get(agent.provider), context.record.root.parent.resolve()
    if cls is None or not cls.briefing_limit():
        return []
    files = read_on_the_way(project, Path(agent.cwd) if agent.cwd else project, cls.briefing_file)
    size = sum(f.stat().st_size for f in files)
    if size <= cls.briefing_limit():
        return []
    names = " with ".join(str(f.relative_to(project)) for f in files)
    return [Sent(f"{names}:{size // BAND}", {"file": names, "size": f"{size:,}", "limit": f"{cls.briefing_limit():,}", "provider": cls.name.title()})]


def read_on_the_way(project: Path, cwd: Path, name: str) -> list[Path]:
    inside = cwd.resolve() if cwd.resolve().is_relative_to(project) else project
    folders = [project, *reversed([p for p in inside.parents if p.is_relative_to(project) and p != project]), inside]
    return [f / name for f in dict.fromkeys(folders) if (f / name).is_file()]
