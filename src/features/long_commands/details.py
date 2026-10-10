from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.groups import Group
from features.work_modes.details import MODES, ORCHESTRATOR

MOVED, KEPT = "moved", "kept"
QUICKLY = 5

RUN_ENDED, RUN_OPEN, RUN_STALLED, WATCHED = "run ended", "run open", "run stalled", "watch runs"


def background_switch(mode: str) -> str:
    return f"{mode}_background"


def background_after(mode: str) -> str:
    return f"{mode}_background_after"


class LongCommandsDetails(FeatureDetails):
    explains = 'The journal moves long terminal commands into the background so the agent can carry on. You can see their progress and results.'
    name = "long_commands"
    group = Group.LONG_COMMANDS
    has_skill = False

    title = "Long commands"

    speaks_while_waiting = True

    abstract = "A command that holds the agent's terminal too long is moved to the background, so the agent can carry on"

    help = """
        When you run a command in the foreground and it is still running after
        long_commands.after_seconds (30), the journal moves it to the background the way your
        own terminal does (Claude's Ctrl+B) and tells you, and tells you again when it ends. A provider without a way to do that is left alone.

        Each work mode has its own switch and its own number of seconds in the settings: while the mode of the
        environment has its switch on, a command goes to the background after that mode's seconds instead (the
        orchestrator, which never waits on a command, after five). A journal command always keeps the longer wait.

        Before moving it, the journal raises agent.command.long, which any feature or plugin can cancel with a reason; a
        cancelled move leaves the command in the foreground and tells you why. The chat shows a mark when a command is moved
        and when it ends.

        An agent whose provider does not wake it when a command it left running ends, as Codex's does not, is
        told by the journal instead: when the command ends, when it has shown nothing new for ten minutes, and when the agent
        stops while it still runs. Each is said once for each command.
    """

    behaviours = [
        Behaviour(
            name=WATCHED,
            title="Remind the agent about commands still running",
            abstract="When one ends, or after it has run ten minutes",
        ),
    ]

    settings = [
        Setting(
            name="after_seconds",
            default=30,
            title="Move it to the background after",
            unit="seconds",
        ),
        *[Setting(name=name, default=default, title=title, unit=unit)
          for mode in MODES
          for name, default, title, unit in ((background_switch(mode), mode == ORCHESTRATOR, f"In {mode} mode, send a command to the background after its own wait", ""),
                                             (background_after(mode), QUICKLY if mode == ORCHESTRATOR else 30, f"In {mode} mode, send it to the background after", "seconds"))],
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
            reply_kept=True,
            title="the command you left running {{outcome}} - {{command}}",
            brief="look at what it printed and carry on with the work it was for",
        ),
        Line(
            name=RUN_OPEN,
            reply_kept=True,
            title="you stopped while a command you started still runs - {{command}}",
            brief="""
                you are told when it ends. Say journal work await "<what you wait for>" to wait for it, or stop it if
                it is no longer needed, and carry on with anything that does not wait on it.
            """,
        ),
        Line(
            name=RUN_STALLED,
            reply_kept=True,
            title="a command you left running has shown nothing new for {{minutes}} minutes - {{command}}",
            brief="check that it still moves; stop it if it hangs, and carry on with what you can do meanwhile",
        ),
    ]
