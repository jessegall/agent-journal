from dataclasses import dataclass

from features.base import FeatureDetails, Line
from features.settings import Setting
from features.groups import Group

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


class WorkModesDetails(FeatureDetails):
    explains = 'You choose whether the agent builds the work, coordinates helpers, or works alone. The journal tells it when that choice changes.'
    name = NAME
    group = Group.AGENT
    label = "Work modes"
    position = 2
    has_skill = False

    title = "Work modes"

    abstract = """
        How the agent works in this environment: as builder, as orchestrator sending helpers, or solo
        with no helpers at all
    """

    help = """
        Pick the mode from the status chip on the phone or the agent bar on the desktop. Builder,
        the default: the agent does the work and sends helpers when a job is better done beside it.
        Orchestrator: the agent plans, sends helpers and subagents, reviews and merges, and writes
        code itself only for reviews and small fixes; it is reminded when it drifts into writing a
        lot of code itself. Its routines ship as sequences, run with journal sequence run <title>: Taking a
        helper's report, Routing a user's report and Cutting a patch release. Solo: the agent does everything itself, and a subagent or helper it
        tries to send is refused. The agent is told when the mode changes, and again at every start.
        The mode also words what the journal says about the next row to take, and a building agent is
        told when its helpers and subagents made more than its own share of the edits in a stretch.
    """

    settings = [
        Setting(
            name="mode",
            default=BUILDER,
            title="Mode",
            choices=tuple(MODES),
        ),
        Setting(
            name="board",
            default=0,
            title="Board that receives new work",
            abstract="0 files new work as to-dos; a board's number makes an orchestrating agent file it as tickets on that board",
            hidden=True,
        ),
        Setting(
            name="drift_after",
            default=8,
            title="Remind a coordinating agent after this many of its own edits",
            unit="edits",
        ),
        Setting(
            name="own_share",
            default=60,
            title="Tell a building agent it has handed the work away below this share of the edits made by itself",
            unit="%",
        ),
    ]

    lines = [
        Line(
            name=MODE_SET,
            while_waiting=True,
            title="the user set the work mode to {{mode}}",
            brief="From now on {{meaning}}.",
        ),
        Line(
            name=BOARD_SET,
            while_waiting=True,
            title="the user set where new work goes: {{where}}",
            brief="From now on {{filing}}",
        ),
        Line(
            name="drifted",
            title="You are the orchestrator here and have made {{edits}} edits yourself: send a helper for the rest, and keep your own edits to reviews and small fixes.",
        ),
        Line(
            name="handed away",
            title="{{share}}% of the edits in this stretch were your own: {{own}} yours against {{theirs}} from your helpers and subagents",
            brief="""
                you are the builder here, not the orchestrator: take the next row yourself and send a helper only
                where the job is better done beside you.
            """,
        ),
    ]
