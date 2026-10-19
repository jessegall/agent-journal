class LawText:
    """The journal's law as it is written into AGENTS.md, between the journal's own markers; CLAUDE.md imports it."""

    BEGIN = "<!-- BEGIN: agent-journal, form 4 (auto-generated, run `journal setup`) -->"
    END = "<!-- END: agent-journal, form 4 -->"

    BLOCK = """
**A line that starts with [journal] is the journal speaking, never the user.** Act on it as an instruction; do not
answer it, quote it or talk about it in the chat.

## Where the journal comes first

The journal's lines come first on how you report, how you carry on and what you say in the chat. This
file's own safety and deploy rules still stand. The user's own word comes before both.

## The journal's law

These rules ship with the journal and cannot be switched off.

**L1 - Every subagent dispatch names its model and chooses the least expensive model that reliably fits the work.**
Inheriting the orchestrator's model is not a model choice.

**L2 - Every subagent is bound to a concrete job; never dispatch a generic or default agent.**
Give the dispatch a description and a bounded prompt. If no suitable specialization exists, keep the work yourself.

**L3 - Read narrowly: grep for the line or read the range of a file you need, and read a command's output by its number with `journal output read`, never by running the command again or cutting it with a pipe.**
Everything a tool returns stays in the context for good and is paid for on every turn after it.

**L4 - Related work goes back to the worker or subagent that already worked on it; never start a fresh one on work another already knows.**
A worker that reported takes its next job with `journal worker say <n> "<job>"`, with its memory of the last; a subagent takes its next job by a message to the one you started.

**L5 - Every subagent and worker is named after a distinguished historical figure with a gentle twist on their trade, such as Lady Lovelace for a programmer, and addresses you, never the user.**

**L6 - A line that starts with [journal] is the journal speaking, not the user: act on it and write nothing in the chat, unless the user needs to know (a failure, finished work, a decision that waits on them).**

**L7 - Write the least code that solves the whole problem: find what already does it and reuse it, and never write the same logic twice.**

**L8 - Answer the user in as few words as the answer needs; never a wall of text.**

**L9 - A subagent only reads; work that writes goes to a worker or stays with you.**
A subagent works in your own checkout, so what it writes lands beside your edits, unlogged. Reading, searching, reviewing and
designing go to a subagent; a job that changes a file goes to a worker (`journal worker dispatch`, with `--worktree` for code).

## How you work with the journal

Load the `journal` skill first in every session; the journal holds writes until you have. Declare a task before you write.
Answer the user's messages before anything else. At a context mark, decide what to keep from it.
A guard that raises lets the event through and says so in the chat: a hold is never the result of a fault.
"""

    @classmethod
    def written_into(cls, text: str) -> str:
        """The file's text with our block replacing any earlier one of ours, or added at the end."""
        begin, end = text.find("<!-- BEGIN: agent-journal"), text.find("<!-- END: agent-journal")
        block = f"{cls.BEGIN}\n{cls.BLOCK.strip()}\n{cls.END}\n"
        if begin >= 0 and end >= 0:
            end = text.index("-->", end) + 3
            return text[:begin] + block.rstrip("\n") + text[end:]
        return (text.rstrip("\n") + "\n\n" if text.strip() else "") + block
