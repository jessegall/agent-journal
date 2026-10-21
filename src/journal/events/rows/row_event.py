from dataclasses import dataclass, field, replace

from journal.events.event import Event
from journal.events.feature_data import FeatureData


@dataclass(frozen=True, kw_only=True)
class RowEvent(Event):
    """What happened to a row, named for the moment: carried by the model that made the change, dispatched by its repository on save, and answered by every live agent of the environment."""

    environment_id: int = 0
    time: float = 0.0
    row_id: int = 0
    session: str = ""
    actor: str = ""
    data: FeatureData = field(default_factory=lambda: FeatureData({}), compare=False)

    @property
    def typed_after(self) -> float:
        return 0.0

    def with_data(self, data: FeatureData) -> "RowEvent":
        return replace(self, data=data)

    def reaching(self, session: str) -> "RowEvent":
        return replace(self, session=session)

    def placed_by(self, environment_id: int, time: float, row_id: int, actor: str) -> "RowEvent":
        return replace(self, environment_id=self.environment_id or environment_id, time=self.time or time, row_id=self.row_id or row_id, actor=actor)

    def is_agents(self, session: str) -> bool:
        return self.actor == f"agent:{session}"
