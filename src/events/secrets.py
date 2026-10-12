"""The moments of the secret resource type."""

from dataclasses import dataclass
from typing import ClassVar

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
