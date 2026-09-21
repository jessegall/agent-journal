from features.trigger import PERCENT, Trigger
from features.base import FeatureDetails, Line
from features.recital import BEHAVIOURS, LINES, WHISPER


class RulesDetails(FeatureDetails):
    name = "rules"

    title = "Rules"

    abstract = """
        The rules said again at every tenth of the context, and the injected ones kept in
        AGENTS.md and CLAUDE.md
    """

    help = """
        A rule binds every environment; one control injects the same managed block into both
        instruction files.

        A fact or rule can carry keywords, a list of words set with --set keywords. When a
        command the agent is about to run, or text it is about to write, carries one of them,
        the row is whispered to that session once, with its reasoning; the call itself is never
        refused.
    """

    runs_for_subagents = True

    trigger = Trigger(every=10, unit=PERCENT)

    lines = [
        *(line for line in LINES if line.name == WHISPER),
        Line(
            name="standing",
            title="{{count}} in force, read them",
            brief="{{rows}}",
        ),
    ]

    behaviours = BEHAVIOURS
