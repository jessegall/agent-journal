from collections.abc import Callable
from dataclasses import dataclass

from engine.checkout.checkout import Checkout
from engine.model.event_form import EventForm
from engine.time.timestamp import Timestamp
from core.modules.plugins.support.agent_facts import AgentFacts
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.runnable_plugin import RunnablePlugin


@dataclass(frozen=True)
class PluginRunRequest:
    """One event to run in a plugin that may run, the time limit for it, and the place a fault is recorded as."""

    runnable: RunnablePlugin
    event: PluginEvent
    form: EventForm
    limit_ms: int | None
    location: str
    environment: str
    timestamp: Timestamp
    agent_id: int | None = None
    script: str = ""
    file_checkout: Checkout | None = None
    wait_callback: Callable[[], None] | None = None
    hook_waits: bool = False
    facts: AgentFacts | None = None
