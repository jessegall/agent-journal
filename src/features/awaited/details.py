from features.base import FeatureDetails, Line
from features.groups import Group


class AwaitedDetails(FeatureDetails):
    name = "awaited"
    group = Group.SESSIONS
    label = "Wait for named agents and background commands"
    hint = "Their results come back when all of them finish"
    skill_of = "todos"
    when = "you wait on a subagent, a helper or a background run"

    title = "Wait for agents and background commands"

    abstract = """
        The agent can wait for named subagents, helpers or background commands. When all of them
        finish, their results come back and the work goes on.
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
