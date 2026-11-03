from dataclasses import dataclass

from core.base.driver.foreign_run import ForeignRun
from core.base.driver.hook_event_name import HookEventName


@dataclass(frozen=True)
class ManagedHookRun:
    """A recorded project hook result and the event that produced it."""

    event: HookEventName
    run: ForeignRun
