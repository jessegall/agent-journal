import re
from dataclasses import dataclass
from pathlib import Path

from providers import PROVIDERS
from engine.stored import write_text
from engine.wording import digest



@dataclass(frozen=True)
class Law:
    name: str
    text: str
    reason: str
    keywords: tuple[str, ...]
    keywords_in: str


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


LAWS = (
    Law("L1", "Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.",
        "Use a fast, economical model for mechanical work with a known answer, a capable general model for careful implementation, and the strongest model only when the task turns on difficult judgement. Inheriting the orchestrator's model is not a model choice. If the dispatch API cannot accept a model, that operation is exempt.",
        ("subagent", "spawn_agent", "haiku", "sonnet", "opus"), "everything"),
    Law("L2", "Every subagent is bound to a concrete job; never dispatch a generic or default agent.",
        "Use the most specific available agent type whose declared purpose matches the assignment. On providers without agent types, give the dispatch a concrete task name and bounded prompt. If no suitable specialization exists, keep the work in the main agent instead of manufacturing an unscoped helper.",
        ("subagent", "spawn_agent", "general-purpose"), "everything"),
    Law("L3", "Read narrowly: grep for the line, sed a range, head the file; never print a whole file or long output you do not need.",
        "Everything a tool returns stays in the context for good and is paid for on every turn after it. Search before you read, read the range you need, and cap output with grep, head or tail. Read a whole file only when you need all of it.",
        ("cat", "less", "git show", "git diff", "journal carry"), "commands"),
    Law("L4", "Follow-up work goes back to the subagent that did the first part; never start a fresh one on work another already holds.",
        "A subagent that drew a design, wrote the code or ran the research keeps what it learned. When the user asks for a change to its work, continue that subagent with a message rather than dispatching a new one that has to rediscover everything; start fresh only when the earlier one is gone or the new work is unrelated.",
        ("subagent", "spawn_agent", "designer", "SendMessage"), "everything"),
    Law("L5", "Every subagent dispatch names the agent: a human name, a little quirky, that fits its role.",
        "A name is how the user and the chat tell subagents apart and how they are messaged later; an id or a task line is not a name. Start the dispatch's description with the name, a colon, then the task, such as \"Dr. Einstein: profile the slow hooks\" or \"Coco Rams: draw the plan card\". A designer can borrow from famous designers, a researcher from famous scientists, mixed up for fun.",
        ("subagent", "spawn_agent", "dispatch"), "everything"),
)
CARTOON = Law("L5", "Every subagent dispatch names the agent: a cartoon character that fits its role.",
              "A name is how the user and the chat tell subagents apart and how they are messaged later; an id or a task line is not a name. Start the dispatch's description with the name, a colon, then the task, such as \"Dora the Explorer: research the slow hooks\" or \"Bob Ross: paint the plan card\". A researcher can borrow from explorers and detectives, a designer from cartoon painters and builders.",
              ("subagent", "spawn_agent", "dispatch"), "everything")


FORM = 2
BEGIN = f"<!-- BEGIN: agent-journal, form {FORM} (auto-generated, run `journal upgrade`) -->"
END = f"<!-- END: agent-journal, form {FORM} -->"
CURRENT = re.compile(r"<!-- BEGIN: agent-journal, form (\d+) [^\n]*-->.*?<!-- END: agent-journal, form \1 -->", re.DOTALL)
CONFLICTED = re.compile(r"^(<{7}|>{7}) ", re.MULTILINE)
BOM = "\ufeff"
GENERIC = frozenset({"", "agent", "default", "general", "general-purpose"})
CURRENT_MARKERS = Markers("<!-- BEGIN: agent-journal, form", "<!-- END: agent-journal, form")
RETIRED = (
    Markers("<!-- BEGIN: agent-journal (auto-generated, run `journal update`) -->", "<!-- END: agent-journal -->"),
    Markers("<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->", "<!-- END: agent-journal law -->"),
    Markers("<!-- journal rules -->", "<!-- /journal rules -->"),
)
PRECEDENCE = ("The journal's lines come first on how you report, how you carry on and what you say in the chat. "
              "This file's own safety and deploy rules still stand. The user's own word comes before both.")
NAMED = re.compile(r"^(?:[A-Z][\w.'-]*\s+){0,3}[A-Z][\w.'-]*\s*:\s*\S")


NAMING = {False: "Start the description with a human name, a little quirky and fitting the role, then a colon and the task, like \"Dr. Einstein: profile the slow hooks\".",
          True: "Start the description with a cartoon character fitting the role, then a colon and the task, like \"Dora the Explorer: research the slow hooks\"."}


def laws(record=None) -> tuple[Law, ...]:
    if record is None or not cartoon_names(record):
        return LAWS
    return tuple(CARTOON if law.name == CARTOON.name else law for law in LAWS)


def cartoon_names(record) -> bool:
    from features.journal_laws.details import LawDetails
    return bool(LawDetails.values(record).cartoon_names)


def carry(record=None) -> str:
    rows = "\n".join(f"  - {law.text}  [{law.name}]" for law in laws(record))
    return f"LAWS THE JOURNAL SHIPS, always in force:\n{rows}"


def block(record=None, rules: tuple[str, ...] = ()) -> str:
    out = [BEGIN, "", "## Where the journal comes first", "", PRECEDENCE, "", "## The journal's law", "",
           "These rules ship with the journal and cannot be switched off.", ""]
    for law in laws(record):
        out.extend((f"**{law.name} — {law.text}**", "", law.reason, ""))
    if rules:
        out.extend(("## Rules", "", *(f"- {rule}" for rule in rules), ""))
    return "\n".join((*out, END))


def injected(record) -> tuple[str, ...]:
    from controllers.types import Rules
    from resources.base import SYSTEM
    return tuple(rule.title for rule in Rules(record, actor=SYSTEM)._standing() if rule.injected)


def brief(project: Path, record) -> Briefing:
    managed = block(record, injected(record))
    title = project.resolve().name
    written, left = [], []
    for name in sorted({cls.briefing_file for cls in PROVIDERS.values() if cls.briefing_file}):
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
            write_text(target, mark + want)
            written.append(project / name)
    return Briefing(tuple(written), tuple(left))


def instructions_hash(project: Path, record) -> str:
    names = sorted({cls.briefing_file for cls in PROVIDERS.values() if cls.briefing_file})
    texts = [CURRENT.sub("", (project / name).read_bytes().decode(errors="replace")) for name in names if (project / name).is_file()]
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


def refusal(dispatch, cartoon: bool = False) -> str:
    if dispatch.kind in GENERIC and dispatch.task in GENERIC:
        return "Journal law L2 refuses generic subagents. Choose a specific agent type or give the dispatch a concrete task name and bounded assignment."
    if dispatch.model_supported and not dispatch.model:
        return "Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work."
    if dispatch.name_supported and not NAMED.match(dispatch.description):
        return f"Journal law L5 requires a name on every subagent dispatch. {NAMING[cartoon]}"
    return ""
