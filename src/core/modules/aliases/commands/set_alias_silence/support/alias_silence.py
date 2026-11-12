from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.time.timestamp import Timestamp
from core.modules.aliases.commands.set_alias_silence.set_alias_silence import SetAliasSilence
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.support.silent_runs import SilentRuns


class AliasSilence:
    """Marks a saved command silent when a run of it printed nothing for 30 seconds, and clears the mark when a run
    of its line, edited after the mark, printed."""

    def __init__(self, aliases: AliasQuery, parts: ProcessPartQuery, silent_runs: SilentRuns, bus: Bus) -> None:
        self.aliases, self.parts, self.silent_runs, self.bus = aliases, parts, silent_runs, bus

    def watch(self, process: Process, timestamp: Timestamp) -> None:
        saved_parts = [part for part in self.parts.process(process.id).get() if part.saved_command]
        silent_match = self.silent_runs.silent_part(process, timestamp) if saved_parts else None
        for part in saved_parts:
            alias = self.aliases.saved(part.saved_command)
            if alias is None or alias.is_claimed or not self.matches_current_line(alias, process):
                continue
            if not self.silent_runs.is_empty_output(part):
                if alias.silent_at is not None:
                    self.set_silence(alias, False, process)
            elif silent_match is not None and silent_match.position == part.position:
                self.set_silence(alias, True, process)

    @staticmethod
    def matches_current_line(alias: Alias, process: Process) -> bool:
        return alias.fixed_at is None or process.creation_timestamp().value >= alias.fixed_at.value

    def set_silence(self, alias: Alias, silent: bool, process: Process) -> None:
        self.bus.run(SetAliasSilence(alias.name, silent), Actor.core(), environment_id=process.environment_id)
