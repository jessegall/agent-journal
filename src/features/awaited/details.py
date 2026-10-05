from features.base import FeatureDetails, Line
from features.groups import Group


class AwaitedDetails(FeatureDetails):
    name = "awaited"
    group = Group.SESSIONS
    label = "Wait for named agents and runs"
    hint = "Results come back when they all finish"
    skill_of = "todos"
    when = "you wait on a subagent, a helper or a background run"

    title = "Waiting on agents and runs"

    abstract = """
        A wait that names the subagents, helpers or background runs it is on stands until they
        have all finished, then hands their results back and the work carries on
    """

    help = """
        journal work await "<what>" --on <id>,<id> names what the wait is on: a subagent's or a
        background run's id as you were given it, or helper:<n>. It stands, with no reminders,
        until every one of them has finished, even while you work on; then their results are
        written into the work's log and you are told once to carry on. A wait without --on clears
        when you work again, as before.
    """

    lines = [
        Line(
            name="returned",
            title="{{awaiting}} came back: {{results}} - carry on with work {{n}}",
        ),
    ]
