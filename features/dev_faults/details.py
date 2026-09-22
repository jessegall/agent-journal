from features.base import Behaviour, FeatureDetails, Line


class FaultsDetails(FeatureDetails):
    name = "dev_faults"

    title = "Developer fault reports"

    speaks_while_waiting = True

    abstract = """
        While developing, what would otherwise pass in silence is reported: anything local that
        runs past its budget, and any error the viewer throws
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
            title="Report anything slower than its budget",
            abstract="Fifty milliseconds for a request, a hook or a command",
        ),
        Behaviour(
            name="console",
            title="Report what the viewer throws",
            abstract="An error in the client's console is filed and said to the agent",
        ),
    ]

    lines = [
        Line(
            name="fault",
            title="{{title}}",
            brief="{{summary}}",
        ),
    ]
