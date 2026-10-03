from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting

MOVED, KEPT = "moved", "kept"
RUN_ENDED, RUN_OPEN, RUN_STALLED, WATCHED = "run ended", "run open", "run stalled", "watch runs"


class LongCommandsDetails(FeatureDetails):
    name = "long_commands"
    has_skill = False

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

        An agent whose provider does not wake it when a command it left running ends, as Codex's does not, is
        told by the journal instead: when the command ends, when it has run ten minutes, and when the agent
        stops while it still runs. Each is said once for each command.
    """

    behaviours = [
        Behaviour(
            name=WATCHED,
            title="Tell an agent about the commands it left running",
            abstract="When one ends, when it has run ten minutes, and when the agent stops while it runs; only for a provider that does not wake the agent itself",
        ),
    ]

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
        Line(
            name=RUN_ENDED,
            title="the command you left running {{outcome}} - {{command}}",
            brief="look at what it printed and carry on with the work it was for",
        ),
        Line(
            name=RUN_OPEN,
            title="you stopped while a command you started still runs - {{command}}",
            brief="""
                you are told when it ends. Say journal work await "<what you wait for>" to wait for it, or stop it if
                it is no longer needed, and carry on with anything that does not wait on it.
            """,
        ),
        Line(
            name=RUN_STALLED,
            title="a command you left running has run for {{minutes}} minutes - {{command}}",
            brief="check that it still moves; stop it if it hangs, and carry on with what you can do meanwhile",
        ),
    ]
