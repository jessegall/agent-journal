"""The moments of the secret resource type, and what the secrets feature recognises: an hour in which deleted secrets may have run out their keeping."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class SecretCreated(ResourceEvent):
    on: ClassVar[str] = "secret.created"


@dataclass(frozen=True)
class SecretUpdated(ResourceEvent):
    on: ClassVar[str] = "secret.updated"


@dataclass(frozen=True)
class SecretCompleted(ResourceEvent):
    on: ClassVar[str] = "secret.completed"


@dataclass(frozen=True, kw_only=True)
class PurgeDue(Fact):
    """An hour has passed since deleted secrets were last checked for values past their keeping."""
