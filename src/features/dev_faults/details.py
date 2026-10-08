from features.base import Behaviour, FeatureDetails, Line
from features.groups import Group


class DevFaultsDetails(FeatureDetails):
    explains = 'The journal records developer errors and tells the agent what failed. You can inspect the error report.'
    name = "dev_faults"
    group = Group.DEVELOPER
    label = "Report developer errors"
    has_skill = False

    title = "Developer error reports"


    abstract = """
        While you work on the journal, it reports what would otherwise go unnoticed: anything slower
        than its time limit, and errors the viewer throws.
    """

    help = """
        Starts on only while developing: DEVELOPMENT_MODE=true in the project's .env or the
        environment; everywhere else it starts off, and either way it can be switched.

        budget: everything here runs on one machine against files, so anything over the budget
        is a bug — faults.budget.request, .hook and .command are milliseconds per environment,
        50 by default, and 0 drops that budget. console: the viewer posts what it throws and it
        is filed the same way. One notification per target, carrying the worst time or the last
        words and how many times it happened.
    """

    default = False

    aliases = (("budget", "budget"), "faults")

    behaviours = [
        Behaviour(
            name="budget",
            title="Report anything slower than its time limit",
        ),
        Behaviour(
            name="console",
            title="Report errors the viewer throws",
        ),
        Behaviour(
            name="log",
            title="Write a diagnostic log",
            abstract=".journal/runtime/diagnostics.log",
            default=False,
        ),
    ]

    lines = [
        Line(
            name="fault",
            title="{{title}}",
            brief="{{summary}}",
        ),
        Line(
            name="overdue",
            title="{{title}}, seen {{times}} times with no to-do open for it: journal todo create \"{{title}}\" before any other write",
        ),
    ]
