from features.base import FeatureDetails, Line


class PlansDetails(FeatureDetails):
    name = "plans"

    title = "Planning"

    abstract = "A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it"

    help = """
        A plan is built in order. journal plan create "<name>" --set goal="<what is true when
        done>" starts it building, at its phases stage. Add every phase with journal plan phase
        <n> "<title>" --when "<complete when>" (--checkpoint where the user should look before
        it goes on).

        Then journal plan stage <n> todos, file the rows and put each under its phase with
        journal plan todos <n> <phase> <rows...>. When every phase has rows, journal plan ready
        <n> hands it to the user.

        Only the user activates a plan and continues it past a checkpoint; with the auto
        feature on, checkpoints are passed without waiting.
    """

    lines = [
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
            brief="journal plan ready {{n}} hands it to the user, who activates it",
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
