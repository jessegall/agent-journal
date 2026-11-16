from collections.abc import Mapping

from engine.event.change import Change
from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.command.context import Context
from engine.model.environment_scoped import EnvironmentScoped
from engine.enums.event_form import EventForm
from engine.model.model import Model
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.plugins.support.block_projection import BlockProjection


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
        return payload

    @staticmethod
    def change_payload(change: Change[Model], form: EventForm, log: EventLog, event_id: int | None) -> dict[str, object]:
        context: Context = change.context
        payload: dict[str, object] = {"form": form.value, "final": form is EventForm.COMMIT, "log_name": change.event, "event_id": event_id,
                   "actor": {"type": context.actor.type.value, "id": context.actor.id}, "command": context.command.label(), "cause_id": context.cause_id,
                   "row": PluginPayload.row(change.row, log), "old_row": PluginPayload.row(change.old_row, log) if change.old_row is not None else {}, "changed": log.data(change)}
        # a hold's event carries the version 2 projection beside the version 1 row, which keeps every field it had
        return {**payload, "hold": BlockProjection.projected(change.row)} if isinstance(change.row, AgentBlock) else payload

    # the stored values of a row, and the fields a plugin read in an earlier version of the row, which its model still answers
    @staticmethod
    def row(row: Model, log: EventLog) -> dict[str, object]:
        return {**log.row_values(row), **{name: getattr(row, name) for name in row.plugin_row_fields}}
