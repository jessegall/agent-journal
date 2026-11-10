from dataclasses import dataclass

from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.tasks.support.closed_tasks import ClosedTasks


@dataclass(frozen=True, kw_only=True)
class Reminder(EnvironmentScoped, Model):
    """Something an agent is told again at a date and time or on an interval of time, tool uses or closed tasks,
    once or until it is removed, and may be held to with a block until a condition comes true."""

    model_name = "reminder"
    cli_name = "reminder"
    search_fields = ["text"]

    environment_id: int = 0
    creator_id: int
    text: str
    interval_seconds: int = 0
    interval_tool_uses: int = 0
    interval_tasks: int = 0
    due_at: Timestamp | None = None
    single_use: bool = False
    block_condition: str = ""
    block_subject: str = ""
    last_fired_at: Timestamp | None = None
    ended_at: Timestamp | None = None

    @property
    def interval(self) -> Interval:
        spans = (Seconds(self.interval_seconds) if self.interval_seconds else None, ToolUseSpan(self.interval_tool_uses) if self.interval_tool_uses else None, ClosedTasks(self.interval_tasks) if self.interval_tasks else None)
        return Interval(*(span for span in spans if span is not None))

    @property
    def has_one_firing(self) -> bool:
        return self.single_use or self.due_at is not None

    def interval_timestamp(self) -> Timestamp:
        return self.last_fired_at or self.creation_timestamp()

    def should_fire(self, timestamp: Timestamp, tool_uses: int, closed_tasks: int) -> bool:
        if self.due_at is not None:
            return self.due_at.value <= timestamp.value
        elapsed_seconds = self.interval_timestamp().elapsed_seconds(timestamp)
        return any((bool(self.interval_seconds) and elapsed_seconds >= self.interval_seconds,
                    bool(self.interval_tool_uses) and tool_uses >= self.interval_tool_uses,
                    bool(self.interval_tasks) and closed_tasks >= self.interval_tasks))
