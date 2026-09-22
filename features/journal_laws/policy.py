import re
from dataclasses import dataclass
from pathlib import Path

from providers import PROVIDERS
from engine.stored import write_text



@dataclass(frozen=True)
class Law:
    name: str
    text: str
    reason: str
    keywords: tuple[str, ...]
    keywords_in: str


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
)
BEGIN = "<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->"
END = "<!-- END: agent-journal law -->"
BLOCK = re.compile(rf"\n?{re.escape(BEGIN)}.*?{re.escape(END)}\n?", re.DOTALL)
GENERIC = frozenset({"", "agent", "default", "general", "general-purpose"})


def carry() -> str:
    rows = "\n".join(f"  - {law.text}  [{law.name}]" for law in LAWS)
    return f"LAWS THE JOURNAL SHIPS, always in force:\n{rows}"


def block() -> str:
    out = [BEGIN, "", "## The journal's law", "", "These rules ship with the journal and cannot be switched off.", ""]
    for law in LAWS:
        out.extend((f"**{law.name} — {law.text}**", "", law.reason, ""))
    return "\n".join((*out, END))


def brief(project: Path) -> list[Path]:
    written = []
    managed = block()
    title = project.resolve().name
    names = sorted({cls.briefing_file for cls in PROVIDERS.values() if cls.briefing_file})
    for name in names:
        target = project / name
        had = target.read_text() if target.is_file() else ""
        kept = BLOCK.sub("\n", had).strip()
        want = f"{kept}\n\n{managed}\n" if kept else f"# {title}\n\n{managed}\n"
        if want != had:
            write_text(target, want)
            written.append(target)
    return written


def refusal(provider, tool) -> str:
    dispatch = provider.dispatch(tool)
    if not dispatch:
        return ""
    if dispatch.get("kind") in GENERIC:
        return "Journal law L2 refuses generic subagents. Choose a specific agent type or give the dispatch a concrete task name and bounded assignment."
    if dispatch.get("model_supported") and not dispatch.get("model"):
        return "Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work."
    return ""
