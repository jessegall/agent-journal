import hashlib
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.enums.managed_state import ManagedState
from engine.enums.hook_effect import HookEffect
from engine.provider.hook_source import HookSource

DEFAULT_TIMEOUT_SECONDS = 30


@dataclass(frozen=True)
class ManagedHook:
    """A project hook and the settings the journal keeps for it."""

    id: str
    program: str
    event: str
    matcher: str
    command: str
    timeout: int
    source: str
    tracked: bool
    fields: Mapping[str, object] = field(default_factory=dict[str, object])
    state: ManagedState = ManagedState.ENABLED
    effects: Sequence[HookEffect] = ()
    sources: Sequence[HookSource] = ()

    def all_sources(self) -> tuple[HookSource, ...]:
        return (HookSource(self.source, self.tracked), *self.sources)

    @classmethod
    def found(cls, program: str, event: str, matcher: str, entry: Mapping[str, object], source: str, tracked: bool) -> "ManagedHook":
        command = str(entry["command"])
        digest = hashlib.sha1(f"{program}{event}{matcher}{command}".encode()).hexdigest()[:8]
        extra = {key: value for key, value in entry.items() if key not in ("type", "command", "timeout")}
        return cls(f"{program}:{event}:{matcher or '*'}:{digest}", program, event, matcher, command,
                   int(str(entry.get("timeout", DEFAULT_TIMEOUT_SECONDS))), source, tracked, extra)
