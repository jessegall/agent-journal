from journal.events.event import Event
from journal.features.feature import Feature
from journal.events.listener import Listener
from journal.features.registry import Registry
from journal.models.scoped import Scoped
from journal.repositories.scope import Scope
from journal.repositories.settings import PROJECT


class Switched(Listener[Event]):
    """A feature's listener on the bus, which runs only where its feature is on, and in the environment its event happened in; so a feature switched off has no listener running, by construction."""

    def __init__(self, feature: type[Feature], inner: Listener, registry: Registry, scope: Scope) -> None:
        self.feature, self.inner, self.registry, self.scope = feature, inner, registry, scope
        self.blocking = getattr(inner, "blocking", False)
        self.asked_while_free = getattr(inner, "asked_while_free", False)

    def handle(self, event: Event) -> object:
        with self.scope.of(self.environment_of(event)):
            if not self.registry.is_on(self.feature):
                return None
            return self.inner.handle(event)

    def environment_of(self, event: Event) -> int:
        """A scoped row's own environment, else the event's; an event about a row of no environment, such as a link, happened where it was fired, or in the project outside every scope."""
        model = getattr(event, "model", None)
        if isinstance(model, Scoped):
            return model.environment_id
        return getattr(event, "environment_id", self.scope.id_or(PROJECT))
