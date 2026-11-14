from collections.abc import Callable, Sequence
from time import perf_counter

from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.enums.state_tier import StateTier
from engine.driver.layer import Layer
from engine.driver.open_row import OpenRow
from engine.driver.state_record import StateRecord
from engine.enums.log_level import LogLevel
from engine.log.error_log import ErrorLog
from engine.log.system_log_writer import SystemLogWriter
from engine.registry.agent_state_entry import AgentStateEntry
from engine.registry.registry import Registry

SLOW_OPENER_SECONDS = 0.1
FAILED_OPENER_TABLE = "failed-opener"


class StateBoard:
    """Which agent states are open for one hook's agent, worked out only when asked and once per opener: a state of
    another driver or a role it does not apply to is closed, and a state whose opener raises is reported once and
    counts as open, so a fault never silences the rules it gates."""

    def __init__(self, registry: Registry, container: Container, errors: ErrorLog, system_log: SystemLogWriter, hook: AgentHook,
                 elapsed: Callable[[], float] = perf_counter) -> None:
        self.registry, self.container, self.errors, self.system_log, self.hook = registry, container, errors, system_log, hook
        self.elapsed = elapsed
        self.opened: dict[str, Sequence[OpenRow]] = {}
        self.opener_milliseconds: dict[str, int] = {}
        self.records: dict[str, StateRecord] = {}

    def is_open(self, entry: AgentStateEntry) -> bool:
        parent = self.registry.agent_state(entry.parent) if entry.parent else None
        if parent is not None and not self.is_open(parent):
            return False
        return bool(self.open_rows(entry))

    def open_rows(self, entry: AgentStateEntry) -> Sequence[OpenRow]:
        if not entry.covers(self.hook.driver):
            return ()
        state = self.container.get(entry.path.checked_class(AgentState))
        if not self.applies_to_role(state):
            return ()
        key = state.opener_key()
        if key not in self.opened:
            self.opened[key] = self.timed_rows(entry, state, key)
        rows = self.opened[key]
        self.records[entry.name] = StateRecord(entry.name, state.tier.name.lower(), self.outcome(rows), self.opener_milliseconds[key])
        return rows

    def stack(self, driver: str) -> list[Layer]:
        layers = [Layer(entry, row) for entry in self.registry.tier_states(driver, int(StateTier.STACK)) for row in self.open_rows(entry)]
        return sorted(layers, key=lambda layer: (layer.row.opened_at, layer.overlay.position, layer.row.row_id), reverse=True)

    # the role check rules use (Registry.driver_rules): the facts of the hook agent's helper type
    def applies_to_role(self, state: AgentState) -> bool:
        return state.role_group.has_role(self.hook.role, self.registry.helper_type_book())

    def timed_rows(self, entry: AgentStateEntry, state: AgentState, key: str) -> Sequence[OpenRow]:
        started_at = self.elapsed()
        rows = self.guarded_rows(entry, state)
        seconds = self.elapsed() - started_at
        if seconds >= SLOW_OPENER_SECONDS:
            self.system_log.write(LogLevel.INFORMATION, f"state {entry.name} took {seconds * 1000:.0f} ms on a {self.hook.hook_name} hook")
        self.opener_milliseconds[key] = round(seconds * 1000)
        return rows

    @staticmethod
    def outcome(rows: Sequence[OpenRow]) -> str:
        if any(row.table == FAILED_OPENER_TABLE for row in rows):
            return FAILED_OPENER_TABLE
        return "open" if rows else "closed"

    def state_records(self) -> tuple[StateRecord, ...]:
        return tuple(self.records.values())

    def guarded_rows(self, entry: AgentStateEntry, state: AgentState) -> Sequence[OpenRow]:
        try:
            return tuple(state.open_rows(self.hook))
        except Exception as error:
            self.errors.reported(["agent state", entry.name], error, self.hook.environment_id)
            return tuple([OpenRow(FAILED_OPENER_TABLE, 0, self.hook.timestamp)])
