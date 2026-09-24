from features.base import FeatureDetails, Line


class PlansDetails(FeatureDetails):
    name = "plans"
    when = "the user asks for a plan, phases or a roadmap, or a plan is started, advanced or finished"

    title = "Planning"


    abstract = "A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it"

    help = """
        A plan is built in order. journal plan create "<name>" --set goal="<what is true when
        done>" --set depth=normal|thorough starts it building, at its phases stage. When the user
        asks for a plan in the chat, settle how thorough it must be first: take it from what they
        said, judge it yourself when the work makes it plain, and ask with a question when you
        cannot tell. A thorough plan is researched and has a to-do for every small thing. Add every phase with journal plan phase
        <n> "<title>" --when "<complete when>" (--checkpoint where the user should look before
        it goes on).

        Then journal plan stage <n> todos, file the rows and put each under its phase with
        journal plan todos <n> <phase> <rows...>, or board tickets with journal plan tickets <n>
        <phase> <tickets...>. When every phase has rows, journal plan ready <n> hands it to the user.

        A plan whose phases hold tickets gets a worker agent of its own when it first starts, in its
        own environment and worktree, and the journal starts each phase's tickets once the phase
        before is done. The environment's own agent stays a co-assistant: asked how a plan is going,
        it answers from journal plan progress <n>, which gives the phase it is in, the state of that
        phase's rows and tickets, and what happened last.

        Only the user approves a plan, and then you start it with journal plan start <n>; only the user continues it past a checkpoint; with the auto
        feature on, checkpoints are passed without waiting.

        One plan runs at a time. Starting a plan parks the one that runs, and journal plan park
        <n> sets a plan aside; a parked plan's rows wait until it is started again.
    """

    lines = [
        Line(
            name="started",
            title="the user started plan {{n}}, {{title}} - build it with them",
            brief="""
                journal plan show {{n}} for what they want, and a template's instructions come
                first; ask what you cannot settle, then add its phases and rows. {{depth}}
            """,
        ),
        Line(
            name="phases",
            title="plan {{n}} is building - add its phases",
            brief="""
                journal plan phase {{n}} "<title>" --when "<complete when>" for each phase,
                --checkpoint where the user should look; then journal plan stage {{n}} todos
            """,
        ),
        Line(
            name="todos",
            title="plan {{n}} is at its to-dos",
            brief="""
                file each phase's rows and put them under it with journal plan todos {{n}}
                <phase> <rows...>; when every phase has rows, journal plan ready {{n}}
            """,
        ),
        Line(
            name="ready",
            title="every phase of plan {{n}} has its to-dos",
            brief="journal plan ready {{n}} hands it to the user, who approves it",
        ),
        Line(
            name="approved",
            title="the user approved plan {{n}}, {{title}} - start it",
            brief="journal plan start {{n}} makes it active and parks a plan that runs; then work its first phase's rows in order",
        ),
        Line(
            name="picked up",
            title="the user started plan {{n}}, {{title}} - it is active now",
            brief="work the rows of its current phase, phase {{phase}}, in order; a plan that ran is parked and its rows wait",
        ),
        Line(
            name="parked",
            title="the user parked plan {{n}}, {{title}}",
            brief="its open rows wait until it is started again: leave them and go on with other work",
        ),
        Line(
            name="plan mode",
            title="plan mode is not used in a journal project",
            brief="""
                write the plan as a journal plan instead: journal plan create "<name>" --set
                goal="<what is true when done>", then its phases and rows
            """,
        ),
    ]
