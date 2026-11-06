from core.base.change.change import Change
from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.model.event_form import EventForm
from core.base.model.model import Model


class PluginPayload:
    """The data of the line a script gets for a change: its form, whether it is final, the row as the log holds it,
    with hidden fields written as hidden, and what changed, as the log holds it. Only a commit is final and has a
    log row."""

    @staticmethod
    def of(change: Change[Model], form: EventForm, log: EventLog, event_id: int | None) -> dict[str, object]:
        context: Context = change.context
        return {"form": form.value, "final": form is EventForm.COMMIT, "log_name": change.event, "event_id": event_id,
                "actor": {"type": context.actor.type.value, "id": context.actor.id}, "command": context.command.label(), "cause_id": context.cause_id,
                "row": log.row_values(change.row), "old_row": log.row_values(change.old_row) if change.old_row is not None else {}, "changed": log.data(change)}
