from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from core.modules.drivers.queries.hook_call_query import HookCallQuery


class DisplayedBlocks:
    """The text block an agent finished writing at a display hook, read once a hook: the lines that judge it and the
    hook call that records it share one read of the parts before it."""

    def __init__(self, hook_calls: HookCallQuery, request_values: RequestValues) -> None:
        self.hook_calls, self.request_values = hook_calls, request_values

    def text(self, agent_id: int, event: HookEvent) -> str:
        if not event.is_final_display:
            return ""
        return self.request_values.read(f"drivers.displayed-block:{agent_id}:{event.firing}", lambda: event.firing, lambda: self.hook_calls.displayed_block(agent_id, event))
