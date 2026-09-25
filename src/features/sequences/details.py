from features.base import FeatureDetails, Line
from features.settings import Setting
from features.sequences.handlers import DISPATCH, IN_CHAT, STEP, STEP_HELD, UNFINISHED, WAITING


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
        --about <ref> hands you the first step, and your writes wait until you take it up with
        journal sequence follow <n> --about <ref>; journal sequence next <n> --about <ref>
        marks the step in hand done and hands the next, and the last one ends it. A step you
        never took up cannot be moved past.
        --set starts_on starts it by itself, about the row it started on: <type>.created or
        <type>.completed for any row type (dump.created, plan.completed), or trigger:<n> to start
        when trigger n fires. Any other value is refused. To start on words or a command, such as a
        deploy, make a trigger that only starts it: journal trigger create "<what it watches for>"
        --set words="<word>,<word>" --set words_in=commands --set does=start, then set the
        sequence's starts_on=trigger:<its n>. Sequences nest like function calls: one that starts
        while another runs is handed to you first, and the one it interrupted comes back when it
        ends; starting one already running about the same row starts it again. Finishing a sequence
        comes before anything else you do. A step standing still is nudged every minute, and
        stopping with a run unfinished sends you back to it. journal sequence abandon <n> --about
        <ref> --why "<why>" gives one up that no longer applies: it names the steps it would skip,
        and takes --sure once you have read them. Some sequences ship
        with the journal; they are system sequences and cannot be changed or removed.
    """

    settings = [
        Setting(
            name="nudge_every",
            default=1,
            title="Nudge the agent about a sequence step standing still every",
            unit="minutes",
        ),
    ]

    lines = [
        Line(
            name=DISPATCH,
            while_waiting=True,
            title="board {{board}} waits for the {{kind}} ({{why}}) - dispatch it now",
            brief="dispatch it and carry on with your own work: the Agent tool with subagent_type \"{{kind}}\", model \"{{model}}\", a "
                  "description that starts with a name, and this prompt: \"You fill board {{board}} for {{about}}. The request: "
                  "'{{request}}'. Now: {{why}}. Your steps are sequence {{n}}, {{title}}. Take up the step in hand with journal --agent {{kind}} "
                  "sequence follow {{n}} --about {{about}}, do it, then journal --agent {{kind}} sequence next {{n}} --about {{about}}, and "
                  "that answers with the next step, already taken up, as journal board score does: do it at once. After a 5 the step is "
                  "the drafting sequence's, whose number it names: go on with that number. The steps are in your profile. Run every journal command with --agent {{kind}}. When you have asked the user a question, stop and "
                  "answer with the question: you are dispatched again with the answer.\"",
        ),
        Line(
            name=IN_CHAT,
            title="what you wrote during {{title}} was kept out of the chat",
            brief="the user is in {{place}}, so say it there with its own command; what the user must know outside it goes in journal message create",
        ),
        Line(
            name=UNFINISHED,
            while_waiting=True,
            title="sequence {{n}}, {{title}}, is still at step {{step}} of {{count}} - carry on with it",
            brief="""
                finishing it comes before anything else. Still to do: {{left}}. Finish the step and
                journal sequence next {{n}}{{about}}
            """,
        ),
        Line(
            name=WAITING,
            while_waiting=True,
            title="you have a sequence going: {{title}}, step {{step}} of {{count}}, {{name}} - how is it going?",
            brief="""
                finishing it comes before anything else; do the step now. {{body}}{{then}}
            """,
        ),
        Line(
            name=STEP,
            while_waiting=True,
            title="sequence {{n}}, {{title}}, step {{step}} of {{count}} - {{name}}",
            brief="Finishing this sequence comes before anything else you do; everything else waits until it is finished or abandoned. "
                  "Take it up first with journal sequence follow {{n}}{{about}}. {{body}}{{chat_rule}}{{then}}",
        ),
        Line(
            name=STEP_HELD,
            while_waiting=True,
            title="sequence {{n}}, {{title}}, handed you step {{step}} - take it up with journal sequence follow {{n}}{{about}} before any other write",
            brief="then do what the step says and journal sequence next {{n}}{{about}}",
        ),
    ]
