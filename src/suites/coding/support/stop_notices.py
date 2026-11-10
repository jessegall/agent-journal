from core.base.driver.hook_event_name import HookEventName
from engine.query.conditions.contains_some import ContainsSome
from engine.query.queries import Queries
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall

FREE_PLACE_TEXT = "can go to a worker and a place is free"
UNFINISHED_TASKS_TEXT = "are yours and unfinished"


class StopNotices:
    """Remembers what the main agent was last told at a stop of one kind, named by a phrase of its notice.
    A notice holds a stop once and comes back only when its words differ: when its tasks or places change."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def has_notice(self, agent_id: int, text: str, phrase: str) -> bool:
        last = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.STOP, answer=HookAnswer.REFUSED).matching(ContainsSome(["refusal"], [phrase])).newest().first()
        return last is not None and text in last.refusal
