from features.base import FeatureDetails, Line
from features.sequences.handlers import STEP, UNFINISHED


class SequencesDetails(FeatureDetails):
    name = "sequences"

    title = "Sequences"

    abstract = "Steps the agent follows in order, one at a time, started by hand or by a moment"

    help = """
        A template says how to do something or where to start; a sequence is a way of
        executing: steps in order, handed to the agent one at a time. Its parts are its steps,
        the title naming the step and the body saying what to do.

        journal sequence create "<name>" --brief "<what it is for>" writes one, and journal
        sequence section <n> "<step>" "<what to do>" adds each step. journal sequence run <n>
        --about <ref> hands the agent the first step; journal sequence next <n> --about <ref>
        marks the step in hand done and hands the next, and the last one ends it.
        --set starts_on=<type.action>, such as dump.created, starts it by itself when that
        happens, about the row it happened to. One run is in the agent's hands at a time; one
        that starts meanwhile waits its turn. Stopping with a run unfinished earns a reminder, and
        journal sequence abandon <n> --about <ref> --why "<why>" gives one up. Some sequences ship
        with the journal; they are system sequences and cannot be changed or removed.
    """

    lines = [
        Line(
            name=UNFINISHED,
            title="sequence {{n}}, {{title}}, is still at step {{step}} of {{count}} - carry on with it",
            brief="""
                finish the step and journal sequence next {{n}}{{about}}; if it no longer applies,
                journal sequence abandon {{n}}{{about}} --why "<why>"
            """,
        ),
        Line(
            name=STEP,
            title="sequence {{n}}, {{title}}, step {{step}} of {{count}} - {{name}}",
            brief="{{body}} When it is done: journal sequence next {{n}}{{about}}",
        ),
    ]
