from features.base import FeatureDetails, Line
from features.settings import Setting


class LongCommandsDetails(FeatureDetails):
    name = "long_commands"

    title = "Long commands"

    speaks_while_waiting = True

    abstract = "A command that holds the agent's terminal too long is moved to the background, so the agent can carry on"

    help = """
        When the agent runs a command in the foreground and it is still running after
        long_commands.after_minutes (2), the journal moves it to the background the way the
        agent's own terminal does (Claude's Ctrl+B) and tells the agent, which is told again when
        it ends. A provider without a way to do that is left alone.
    """

    settings = [
        Setting(
            name="after_minutes",
            default=2,
            title="Move a command to the background after",
            unit="minutes",
        ),
    ]

    lines = [
        Line(
            name="moved",
            title="your command ran {{minutes}} min in the foreground and was moved to the background",
            brief="carry on with other work; you are told when it ends",
        ),
    ]
