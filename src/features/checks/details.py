from features.base import FeatureDetails, Line


class ChecksDetails(FeatureDetails):
    name = "checks"
    when = "a check is created, run or fails"

    title = "Checks"


    abstract = """
        Scripts that say pass or fail about the project, run on demand or on their own timer; a
        failure is filed and told to the agent
    """

    help = """
        A check is a row of its own: journal check create "<what it guards>" --set
        command="<command>" --set every=<minutes>. It runs as its own process from the project
        root, never inside the server; exit 0 passes.

        A failing run files a notification and tells you; the next pass clears it.

        A check may also write a report to the file named by $JOURNAL_REPORT: {"title": ...,
        "summary": ..., "findings": [{"name", "file", "line", "where", "text", "group"}]}. The
        viewer shows its findings under the check, grouped, each opening its file at its line.
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
            label="Check failed",
        ),
    ]
