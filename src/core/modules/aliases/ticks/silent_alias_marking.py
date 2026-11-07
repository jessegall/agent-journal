from core.base.clock import Clock
from core.base.container import Container
from core.modules.aliases.support.alias_silence import AliasSilence
from core.modules.processes.queries.process_query import ProcessQuery


class SilentAliasMarking:
    """Marks a saved command silent while a run of it prints nothing, and clears the mark when a run of its edited line prints."""

    def __call__(self, container: Container) -> bool:
        timestamp = container.get(Clock).timestamp()
        silence = container.get(AliasSilence)
        for process in tuple(container.get(ProcessQuery).running().moved().all_rows()):
            silence.watch(process, timestamp)
        return False
