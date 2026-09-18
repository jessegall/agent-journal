from __future__ import annotations

import fmt
from templates import render as fill

#: EACH ONE IS A CLAIM AND ITS REASONING, exactly as a written rule is: the claim is the
#: line injected everywhere, the body is read on demand. The body is not injected — the same
#: bargain `rules add --brief` strikes, for the same reason.
RULES = (
    {
        "id": "B1",
        "fact": ("Never dispatch a subagent without naming its model: haiku for mechanical "
                 "work with a known answer, sonnet for care without invention, opus only "
                 "where the task turns on judgement. Unset hands out the orchestrator's own, "
                 "which is the most expensive model in the room."),
        "body": (
            "Decide from what the task demands, not from habit.\n\n"
            "**haiku** — mechanical work with a known answer: run this, list what matches, "
            "apply a stated substitution.\n"
            "**sonnet** — ordinary work that needs care but no invention: trim comments to "
            "one sentence, convert a file to a stated pattern, write a test to a given "
            "shape.\n"
            "**opus** — only where the task turns on judgement: a design call, a review, an "
            "ambiguous failure.\n\n"
            "The orchestrator's own model is the most expensive one in the room and is "
            "almost never the right one for the work it hands out; leaving `model` unset "
            "hands out exactly that.\n\n"
            "The user naming a model is not an exception to this rule — it is the rule being "
            "followed. What it forbids is dispatching without deciding."
        ),
    },
)

#: The BEGIN/END markers of the block written into CLAUDE.md and AGENTS.md. The convention
#: is the user's own, from `code-commandments`: an HTML comment so it is invisible in
#: rendered markdown, naming the package and the command that regenerates it, so a reader
#: who edits inside the block is told in the block why their edit will vanish.
MARK = "agent-journal"
MESSAGES = {
    "heading": "## Rules the journal ships",
    "lead": "These come with the journal itself and hold in every project that installs it. They are not this "
            "project's opinions; `journal rules` shows the project's own beside them.",
    "rule": "**{id} — {fact}**",
    "carry": "RULES THE JOURNAL ITSELF SHIPS, in force here as in every project:\n{rows:\n}{cut}",
    "carry_row": "  - {fact}  \\[{id}\\]",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


BEGIN = f"<!-- BEGIN: {MARK} (auto-generated, run `journal update`) -->"
END = f"<!-- END: {MARK} -->"


def block() -> str:
    out = [BEGIN, "", say("heading"), "", say("lead"), ""]
    for r in RULES:
        out += [say("rule", id=r["id"], fact=r["fact"]), ""]
        out += [r["body"], ""]
    out.append(END)
    return "\n".join(out)


def carry(brief: bool = False) -> str:
    if not RULES:
        return ""
    rows = [say("carry_row", fact=fmt.gist(r["fact"]) if brief else r["fact"], id=r["id"]) for r in RULES]
    return say("carry", rows=rows, cut=fmt.cut(len(RULES), len(RULES), "journal rules", shortened=brief))


def by_id(ref: str):
    want = (ref or "").strip().upper()
    return next((r for r in RULES if r["id"] == want), None)
