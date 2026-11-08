from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.aliases.commands.set_alias_silence.support.alias_silence import AliasSilence
from core.modules.processes.events.process_ended import ProcessEnded


class EndedRunSilenceListener(SaveListener[ProcessEnded]):
    """A run that ends before the next tick still clears the silent mark of an edited saved command that printed."""

    name = "aliases.ended-run-silence"

    def __init__(self, silence: AliasSilence) -> None:
        self.silence = silence

    def handle(self, event: ProcessEnded, context: Context) -> None:
        self.silence.watch(event.row, context.timestamp)
