from core.base.driver.hook_event_name import HookEventName
from core.base.query.conditions.contains_some import ContainsSome
from core.base.query.queries import Queries
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall

FREE_PLACE_TEXT = "can go to a worker and a place is free"


class FreePlaceNotices:
    """Remembers what the main agent was last told about a free worker place: the notice holds a stop once, and comes
    back only when its words differ, that is when a task came or went or the free places changed."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def has_notice(self, agent_id: int, text: str) -> bool:
        last = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.STOP, answer=HookAnswer.REFUSED).matching(ContainsSome(["refusal"], [FREE_PLACE_TEXT])).newest().first()
        return last is not None and text in last.refusal
