"""Rules the PACKAGE ships, in force on every project that installs it.

A RULE THE USER CAN DELETE IS A DEFAULT, NOT A RULE. Everything else in this record is
somebody's: written here, numbered here, strikable here, and absent from a fresh install.
These are the journal's own — they arrive with the code, they reach every project, and
`rules strike` refuses them. The user's word for it: baked in.

WHY THERE IS EXACTLY ONE. The bar is not "good advice"; it is: does this bind every agent
in every project, whatever the project is about? "A subagent runs on the cheapest model
that meets the task" passes — it is about how agents are dispatched, which is true of a PHP
kit and a Rust compiler alike. "A subagent runs no git" does not, however sound it is in the
project it came from: that is a workflow, and a tool that ships workflows is a tool with
opinions about a codebase it has never read. The user drew that line themselves.

THEY ARE NUMBERED APART. `B1`, not `1`, because the project's rules are numbered by their
position in its own list and inserting the package's at the front would move every citation
ever written. `journal rules` shows both, marked, so a reader can always tell "this project
decided" from "the tool ships this" — a rule whose provenance is unclear is one nobody can
find the argument for.
"""
from __future__ import annotations

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
BEGIN = f"<!-- BEGIN: {MARK} (auto-generated, run `journal update`) -->"
END = f"<!-- END: {MARK} -->"


def block() -> str:
    """The managed block, whole. Replaced between the markers, never merged."""
    out = [BEGIN, "", "## Rules the journal ships", "",
           "These come with the journal itself and hold in every project that installs it. "
           "They are not this project's opinions; `journal rules` shows the project's own "
           "beside them.", ""]
    for r in RULES:
        out += [f"**{r['id']} — {r['fact']}**", ""]
        out += [r["body"], ""]
    out.append(END)
    return "\n".join(out)


def carry() -> str:
    """The one-line claims, for the block a session is handed at its start."""
    if not RULES:
        return ""
    return ("RULES THE JOURNAL ITSELF SHIPS, in force here as in every project:\n"
            + "\n".join(f"  - {r['fact']}  [{r['id']}]" for r in RULES))


def by_id(ref: str):
    """One shipped rule by its id, or None. `rules show B1` reads its reasoning."""
    want = (ref or "").strip().upper()
    return next((r for r in RULES if r["id"] == want), None)
