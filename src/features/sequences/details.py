from features.base import FeatureDetails, Line
from features.sequences.handlers import IN_CHAT, STEP, UNFINISHED, WAITING


class SequencesDetails(FeatureDetails):
    name = "sequences"
    when = "a sequence is run, stepped or written"

    title = "Sequences"


    abstract = "Steps the agent follows in order, one at a time, started by hand or by a moment"

    help = """
        A template says how to do something or where to start; a sequence is a way of
        executing: steps in order, handed to you one at a time. Its parts are its steps,
        the title naming the step and the body saying what to do.

        Write sequences for the project you work in. When the user describes a routine ("every time
        we deploy, first ..."), or you find yourself doing the same steps a second time (a release, a
        review, setting up a new feature), write it down as a sequence: one step per thing to do,
        each saying exactly what to run or check, and set how it starts, by a row's moment or by a
        trigger on the words that mean it is time. Tell the user in one line that you wrote it, so
        they can change it; a sequence that only you know about helps no one.

        journal sequence create "<name>" --brief "<what it is for>" writes one, and journal
        sequence section <n> "<step>" "<what to do>" adds each step. Steps another sequence
        already has are not written twice: journal sequence include <n> <other> [--steps 2-3]
        adds a step that hands out that sequence's steps, or only the ones named, in its place.
        journal sequence run <n>
        --about <ref> hands you the first step; journal sequence next <n> --about <ref>
        marks the step in hand done and hands the next, and the last one ends it.
        --set starts_on starts it by itself, about the row it started on: <type>.created or
        <type>.completed for any row type (dump.created, plan.completed), or trigger:<n> to start
        when trigger n fires. Any other value is refused. To start on words or a command, such as a
        deploy, make a trigger that only starts it: journal trigger create "<what it watches for>"
        --set words="<word>,<word>" --set words_in=commands --set does=start, then set the
        sequence's starts_on=trigger:<its n>. One run is in your hands at a time; one
        that starts meanwhile waits its turn. Stopping with a run unfinished earns a reminder, and
        journal sequence abandon <n> --about <ref> --why "<why>" gives one up. Some sequences ship
        with the journal; they are system sequences and cannot be changed or removed.
    """

    lines = [
        Line(
            name=IN_CHAT,
            title="you wrote in the chat during {{title}}",
            brief="the user is in {{place}} and does not read the chat while it runs; say it there, or not at all",
        ),
        Line(
            name=UNFINISHED,
            title="sequence {{n}}, {{title}}, is still at step {{step}} of {{count}} - carry on with it",
            brief="""
                finish the step and journal sequence next {{n}}{{about}}; if it no longer applies,
                journal sequence abandon {{n}}{{about}} --why "<why>"
            """,
        ),
        Line(
            name=WAITING,
            title="sequence {{n}}, {{title}}: step {{step}} of {{count}} has waited two minutes - {{name}}",
            brief="""
                the user is waiting on this step; do it now. {{body}} When it is done: journal sequence next
                {{n}}{{about}}
            """,
        ),
        Line(
            name=STEP,
            title="sequence {{n}}, {{title}}, step {{step}} of {{count}} - {{name}}",
            brief="{{body}}{{chat_rule}} When it is done: journal sequence next {{n}}{{about}}",
        ),
    ]
