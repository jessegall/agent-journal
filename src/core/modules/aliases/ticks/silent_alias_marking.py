from engine.time.clock import Clock
from engine.container.container import Container
from core.modules.aliases.commands.set_alias_silence.support.alias_silence import AliasSilence
from core.modules.processes.queries.process_query import ProcessQuery

SILENT_RUNS_REASON = "the tick watches every running background run for a silent saved command"


class SilentAliasMarking:
    """Marks a saved command silent while a run of it prints nothing, and clears the mark when a run of its
    edited line prints."""

    def __call__(self, container: Container) -> bool:
        timestamp = container.get(Clock).timestamp()
        silence = container.get(AliasSilence)
        for process in tuple(container.get(ProcessQuery).running().moved().every_row(SILENT_RUNS_REASON)):
            silence.watch(process, timestamp)
        return False
