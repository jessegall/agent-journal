from features.base import FeatureDetails, Line


class ChecksDetails(FeatureDetails):
    name = "checks"

    title = "Checks"

    speaks_while_waiting = True

    abstract = """
        Scripts that say pass or fail about the project, run on demand or on their own timer; a
        failure is filed and told to the agent
    """

    help = """
        A check is a row of its own: journal check create "<what it guards>" --set
        command="<command>" --set every=<minutes>. It runs as its own process from the project
        root, never inside the server; exit 0 passes.

        A failing run files a notification and tells the agent; the next pass clears it.
    """

    lines = [
        Line(
            name="failed",
            title="{{title}}",
            brief="journal check show {{n}} says why; fix it, then journal check run {{n}}",
        ),
        Line(
            name="failing",
            title="{{title}}",
            brief="{{output}}",
        ),
    ]
