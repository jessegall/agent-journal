from features.base import FeatureDetails, Line
from features.settings import Setting
from features.work_modes.modes import HANDS_ON, NAME


class WorkModesDetails(FeatureDetails):
    name = NAME
    has_skill = False

    title = "Work modes"

    abstract = """
        How the agent works in this environment: hands-on, as orchestrator sending helpers, or solo
        with no helpers at all
    """

    help = """
        Pick the mode from the status chip on the phone or the agent bar on the desktop. Hands-on,
        the default: the agent does the work and sends helpers when a job is better done beside it.
        Orchestrator: the agent plans, sends helpers and subagents, reviews and merges, and writes
        code itself only for reviews and small fixes; it is reminded when it drifts into writing a
        lot of code itself. Solo: the agent does everything itself, and a subagent or helper it
        tries to send is refused. The agent is told when the mode changes, and again at every start.
    """

    settings = [
        Setting(
            name="mode",
            default=HANDS_ON,
            title="How the agent works: hands-on, orchestrator or solo",
        ),
        Setting(
            name="drift_after",
            default=8,
            title="In orchestrator mode, remind the agent after this many of its own file edits",
            unit="edits",
        ),
    ]

    lines = [
        Line(
            name="drifted",
            title="You are the orchestrator here and have made {{edits}} edits yourself: send a helper for the rest, and keep your own edits to reviews and small fixes.",
        ),
    ]
