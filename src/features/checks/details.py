from resources.base import PROJECT
from features.base import FeatureDetails, Line
from features.groups import Group


class ChecksDetails(FeatureDetails):
    explains = 'The agent can run saved checks and inspect their results. You can run a check in the viewer whenever you need it.'
    name = "checks"
    group = Group.SHARED_RECORDS
    scope = PROJECT
    label = "Checks"
    hint = "Scripts that pass or fail; a failure is filed"
    when = "a check is created, run or fails"

    title = "Checks"


    abstract = """
        Scripts that say pass or fail about the project, run on demand or on a schedule of their own; a
        failure is filed and told to the agent
    """

    help = """
        A check is a row of its own: journal check create "<what it guards>" --set
        command="<command>" --set every=<minutes>. It runs as its own process from the project
        root, never inside the server; exit 0 passes. A command cannot use an MCP server (Linear, for
        one): it is a process of its own, and the agent's authorized integrations are not its to
        reach. For that, give the check an instruction instead of a command: journal check create
        "<what it guards>" --set instruction="<what to check, and with what>" --set every=<minutes>.
        At its interval the journal hands the instruction to you as a turn; do it with whatever you
        can reach, then answer with journal check pass <n> (--note "<what you saw>") or journal check
        fail <n> "<why>". A failure is filed and told like any other.

        A failing run files a notification and tells you; the next pass clears it.

        A check may also write a report to the file named by $JOURNAL_REPORT: {"title": ...,
        "summary": ..., "findings": [{"name", "file", "line", "where", "text", "group"}]}. The
        viewer shows its findings under the check, grouped, each opening its file at its line.

        While you iterate, journal check touched <n> runs only the tests beside what changed since
        the last commit, through the check's touched command (--set touched="<command with
        {tests}>"), and names what no test covers. To commit, journal check gate <n> "<message>"
        --paths <path>,<path> runs the whole check in the background and commits exactly those
        paths on a pass, then runs the check's then command (--set then="<push, install>"); you
        are told either way, so there is no log to read.
    """

    lines = [
        Line(
            name="failed",
            reply_kept=True,
            while_waiting=True,
            title="{{title}}",
            brief="journal check show {{n}} says why; fix it, then journal check run {{n}}",
        ),
        Line(
            name="failing",
            reply_kept=True,
            title="{{title}}",
            brief="{{output}}",
            label="Check failed",
        ),
    ]
