from features.base import FeatureDetails, Line
from features.settings import Setting

MOVED, KEPT = "moved", "kept"


class LongCommandsDetails(FeatureDetails):
    name = "long_commands"

    title = "Long commands"

    speaks_while_waiting = True

    abstract = "A command that holds the agent's terminal too long is moved to the background, so the agent can carry on"

    help = """
        When you run a command in the foreground and it is still running after
        long_commands.after_seconds (30), the journal moves it to the background the way your
        own terminal does (Claude's Ctrl+B) and tells you, and tells you again when it ends. A provider without a way to do that is left alone.

        Before moving it, the journal raises agent.command.long, which any feature or plugin can cancel with a reason; a
        cancelled move leaves the command in the foreground and tells you why. The chat shows a mark when a command is moved
        and when it ends.
    """

    settings = [
        Setting(
            name="after_seconds",
            default=30,
            title="Move a command to the background after",
            unit="seconds",
        ),
    ]

    lines = [
        Line(
            name=MOVED,
            title="your command ran {{seconds}}s in the foreground and was moved to the background",
            brief="carry on with other work; you are told when it ends. Start a command you expect to take long in the background yourself",
        ),
        Line(
            name=KEPT,
            title="your long command stays in the foreground",
            brief="it was not moved to the background because: {{reason}}",
        ),
    ]
