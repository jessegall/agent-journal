from engine.agent_machine.needs.line_history import LineHistory
from engine.time.timestamp import Timestamp
from core.modules.drivers.support.hook_rule_histories import HookRuleHistories

NO_LAYER = ""


class TableLineHistory(LineHistory):
    """Reads when a source last spoke from the rule history rows the step writes for its lines, under the old
    rule's name and no layer; an agent's rows are read once a hook."""

    def __init__(self, histories: HookRuleHistories) -> None:
        self.histories = histories

    def last_spoke(self, source_key: str, agent_id: int) -> Timestamp | None:
        history = self.histories.rows(agent_id).get((source_key, NO_LAYER))
        return history.last_answer_at if history is not None else None
