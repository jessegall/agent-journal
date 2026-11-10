from collections.abc import Mapping

from engine.change.change import Change
from engine.change.event_log import EventLog
from engine.change.logged_event import LoggedEvent
from engine.command.context import Context
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.event_form import EventForm
from core.base.model.model import Model


class PluginPayload:
    """Builds event data sent to plugin scripts."""

    @staticmethod
    def environment_id(change: Change[Model]) -> int | None:
        row = change.row
        return (row.environment_id if isinstance(row, EnvironmentScoped) else None) or change.context.environment_id

    @staticmethod
    def logged(logged: LoggedEvent, actor_type: str, row: Mapping[str, object], old_row: Mapping[str, object]) -> dict[str, object]:
        return {"form": EventForm.COMMIT.value, "final": True, "log_name": logged.event, "event_id": logged.id, "actor": {"type": actor_type, "id": logged.actor_id},
                "command": logged.command, "cause_id": logged.cause_id, "row": dict(row), "old_row": dict(old_row), "changed": dict(logged.data)}

    @staticmethod
    def change_payload(change: Change[Model], form: EventForm, log: EventLog, event_id: int | None) -> dict[str, object]:
        context: Context = change.context
        return {"form": form.value, "final": form is EventForm.COMMIT, "log_name": change.event, "event_id": event_id,
                "actor": {"type": context.actor.type.value, "id": context.actor.id}, "command": context.command.label(), "cause_id": context.cause_id,
                "row": log.row_values(change.row), "old_row": log.row_values(change.old_row) if change.old_row is not None else {}, "changed": log.data(change)}
