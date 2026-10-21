from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.models.entry import Entry
from journal.models.scoped import Scoped
from journal.repositories.entries import Entries
from journal.repositories.scope import PROJECT

ACTIONS = {Created: "created", Updated: "updated", Deleted: "deleted"}


class RecordChanges(Listener[ModelEvent]):
    """Every row made, changed or removed is an entry in the timeline, which is what the viewer's live updates read, but for a model kept out of it."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def handle(self, event: ModelEvent) -> None:
        action = ACTIONS.get(type(event))
        if action is None or not event.model.timeline_visible:
            return
        model = event.model
        environment = model.environment_id if isinstance(model, Scoped) else PROJECT
        changed = list(event.changed()) if isinstance(event, Updated) else []
        self.entries.save(Entry(environment_id=environment, kind=action, actor=event.actor, data={"table": model.table(), "id": model.id, "title": getattr(model, "title", "") or getattr(model, "text", "")[:80], "changed": changed}), event.actor)
