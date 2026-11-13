from dataclasses import replace

from engine.enums.execution_lane import ExecutionLane
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_classes import ExecutionClasses
from engine.execution.lane_limits import LaneLimits
from engine.execution.person_classes import PersonClasses
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.execution_class_row import ExecutionClassRow
from core.modules.processes.support.process_settings import ProcessSettings

CAPACITY_SETTINGS = {ExecutionLane.INSTANT: ProcessSetting.LANE_CAPACITY_INSTANT, ExecutionLane.SHORT: ProcessSetting.LANE_CAPACITY_SHORT,
                     ExecutionLane.LONG: ProcessSetting.LANE_CAPACITY_LONG}
STORED_CLASSES_REASON = "The person's classes are few, and a match reads every one of them."
PERCENT = 100


class StoredExecutionClasses(PersonClasses):
    """The classes the person added or changed, kept in the database, and the lane limits the settings give: the
    default table of limits stays in the engine, the settings change only each lane's capacity and the share of
    it one starter may hold."""

    def __init__(self, queries: Queries, settings: ProcessSettings, kept: KeptRows) -> None:
        self.queries, self.settings, self.kept = queries, settings, kept

    # kept until the table changes, so every ticket of a grant asks the same rows
    def classes(self) -> tuple[ExecutionClass, ...]:
        rows = self.queries.query(ExecutionClassRow)
        return self.kept.read(rows, lambda: tuple(row.execution_class for row in rows.every_row(STORED_CLASSES_REASON)), name="processes.execution_classes")

    def lane_limits(self) -> LaneLimits:
        capacities = {lane: self.settings.integer(setting) for lane, setting in CAPACITY_SETTINGS.items()}
        share = self.settings.integer(ProcessSetting.STARTER_CAP_PERCENT)
        return replace(DEFAULT_LANE_LIMITS, capacities=capacities, starter_caps={lane: max(1, capacity * share // PERCENT) for lane, capacity in capacities.items()})

    # a row is refused before it is kept when its cost could never fit its lane
    def validated(self, execution_class: ExecutionClass) -> ExecutionClass:
        ExecutionClasses.validate(execution_class, self.lane_limits().capacity(execution_class.lane))
        return execution_class
