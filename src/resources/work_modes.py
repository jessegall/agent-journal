"""The work modes: what each means, what it says to do with the next ready row, and what it writes into the project's instructions."""

from dataclasses import dataclass

NAME = "work_modes"
BUILDER, ORCHESTRATOR, SOLO = "builder", "orchestrator", "solo"


@dataclass(frozen=True)
class Mode:
    """What a work mode means, what it says to do with the next ready row, and what it writes into the project's instructions."""
    meaning: str
    taking: str
    written: str


MODES = {
    BUILDER: Mode(
        meaning="you do the work yourself and send helpers or subagents when a job is better done beside you",
        taking="do the work yourself, or send a helper for it where the job is better done beside you",
        written="You are the builder here: you do the work yourself. A helper or a subagent is for a job that is better done beside you - a long search, a build in a "
                "checkout of its own, work you cannot do and watch at once. Handing away what you could do in three minutes is the failure, not the saving.",
    ),
    ORCHESTRATOR: Mode(
        meaning="you plan, send helpers and subagents to do the work, review what they bring back and merge it; "
                "you write code yourself only for reviews and small fixes",
        taking="send a helper or subagent to do it and review what it brings back; write code yourself only for reviews and small fixes",
        written="You are the orchestrator here: you plan the work, send helpers and subagents to do it, and review and merge what they bring back. "
                "Write code yourself only for a review or a small fix.",
    ),
    SOLO: Mode(
        meaning="you do all the work yourself: no subagents and no helpers",
        taking="do the work yourself: there are no helpers or subagents here",
        written="You work alone here: all of it is yours to do. Dispatch no helper and no subagent.",
    ),
}
MODE_SET = "mode set"
BOARD_SET = "board set"
NEW_WORK_TO_DOS = 'journal todo create "<title>" --brief "<why, where to start>"'


def kept_mode(kept: str) -> str:
    return kept if kept in MODES else BUILDER
