import re
from pathlib import Path

LAWS = (
    ("L1", "Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.",
     "Use a fast, economical model for mechanical work with a known answer, a capable general model for careful implementation, and the strongest model only when the task turns on difficult judgement. Inheriting the orchestrator's model is not a model choice. If the dispatch API cannot accept a model, that operation is exempt."),
    ("L2", "Every subagent is bound to a concrete job; never dispatch a generic or default agent.",
     "Use the most specific available agent type whose declared purpose matches the assignment. On providers without agent types, give the dispatch a concrete task name and bounded prompt. If no suitable specialization exists, keep the work in the main agent instead of manufacturing an unscoped helper."),
)
BEGIN = "<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->"
END = "<!-- END: agent-journal law -->"
BLOCK = re.compile(rf"\n?{re.escape(BEGIN)}.*?{re.escape(END)}\n?", re.DOTALL)
GENERIC = frozenset({"", "agent", "default", "general", "general-purpose"})


def carry() -> str:
    rows = "\n".join(f"  - {fact}  [{name}]" for name, fact, _ in LAWS)
    return f"LAWS THE JOURNAL SHIPS, always in force:\n{rows}"


def block() -> str:
    out = [BEGIN, "", "## The journal's law", "", "These rules ship with the journal and cannot be switched off.", ""]
    for name, fact, reason in LAWS:
        out.extend((f"**{name} — {fact}**", "", reason, ""))
    return "\n".join((*out, END))


def brief(project: Path) -> list[Path]:
    written = []
    managed = block()
    title = project.resolve().name
    for name in ("AGENTS.md", "CLAUDE.md"):
        target = project / name
        had = target.read_text() if target.is_file() else ""
        kept = BLOCK.sub("\n", had).strip()
        want = f"{kept}\n\n{managed}\n" if kept else f"# {title}\n\n{managed}\n"
        if want != had:
            target.write_text(want)
            written.append(target)
    return written


def refusal(provider: str, payload: dict) -> str:
    tool = str(payload.get("tool_name") or "")
    data = payload.get("tool_input") or {}
    if provider == "claude" and tool == "Agent":
        kind = str(data.get("subagent_type") or "").strip().lower()
        if kind in GENERIC:
            return "Journal law L2 refuses generic subagents. Choose the specific agent type whose declared job matches this assignment."
        if kind != "fork" and not str(data.get("model") or "").strip():
            return "Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work."
    if provider == "codex" and tool.endswith("spawn_agent"):
        kind = str(data.get("task_name") or "").strip().lower()
        if kind in GENERIC:
            return "Journal law L2 refuses generic subagents. Give this dispatch a concrete task name and bounded assignment."
        if not str(data.get("model") or "").strip():
            return "Journal law L1 requires an explicit model on every subagent dispatch. Choose the least expensive model that reliably fits the work."
    return ""
