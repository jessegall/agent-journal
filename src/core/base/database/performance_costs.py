from core.base.database.database import Database
from core.base.database.points import Points
from core.base.performance.performance_state import PerformanceState


class PerformanceCosts:
    """Captures point totals only while development measurements are enabled."""

    def __init__(self, database: Database, state: PerformanceState) -> None:
        self.database, self.state = database, state

    def begin(self) -> Points | None:
        return self.database.repeated_work.points() if self.state.can_measure else None

    def cost(self, start_points: Points | None) -> Points | None:
        if start_points is None or not self.state.can_measure:
            return None
        return self.database.repeated_work.points().minus(start_points)
