from collections.abc import Mapping

from engine.event.change import Change
from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.command.context import Context
from engine.model.environment_scoped import EnvironmentScoped
from engine.enums.event_form import EventForm
from engine.model.model import Model
from core.modules.plugins.support.block_projection import BLOCK_MODEL, BlockProjection


class PluginPayload:
    """Builds event data sent to plugin scripts."""

    @staticmethod
    def environment_id(change: Change[Model]) -> int | None:
        row = change.row
        return (row.environment_id if isinstance(row, EnvironmentScoped) else None) or change.context.environment_id

    @staticmethod
    def logged(logged: LoggedEvent, actor_type: str, row: Mapping[str, object], old_row: Mapping[str, object]) -> dict[str, object]:
        payload = {"form": EventForm.COMMIT.value, "final": True, "log_name": logged.event, "event_id": logged.id, "actor": {"type": actor_type, "id": logged.actor_id},
                   "command": logged.command, "cause_id": logged.cause_id, "row": dict(row), "old_row": dict(old_row), "changed": dict(logged.data)}
        return PluginPayload.with_block(payload, logged.event)

    @staticmethod
    def change_payload(change: Change[Model], form: EventForm, log: EventLog, event_id: int | None) -> dict[str, object]:
        context: Context = change.context
        payload = {"form": form.value, "final": form is EventForm.COMMIT, "log_name": change.event, "event_id": event_id,
                   "actor": {"type": context.actor.type.value, "id": context.actor.id}, "command": context.command.label(), "cause_id": context.cause_id,
                   "row": log.row_values(change.row), "old_row": log.row_values(change.old_row) if change.old_row is not None else {}, "changed": log.data(change)}
        return PluginPayload.with_block(payload, change.event)

    # a hold's event carries the version 2 projection beside the version 1 row, which keeps every field it had
    @staticmethod
    def with_block(payload: dict[str, object], event: str) -> dict[str, object]:
        row = payload["row"]
        if event.partition(".")[0] != BLOCK_MODEL or not isinstance(row, Mapping):
            return payload
        return {**payload, "hold": BlockProjection.projected(row)}
