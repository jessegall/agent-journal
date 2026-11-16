from engine.agent_stack.reason import Reason
from engine.agent_stack.states.state import State
from engine.agent_stack.states.working import Working
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.command.bus import Bus
from engine.enums.decision_class import DecisionClass
from engine.query.queries import Queries

REVIEW_RANK = "tasks.review"


# @sin architecture_drivers_state_defined_outside_the_stack
class Reviewed(State):
    pass


class ReviewStates(StateSource):
    # @sin architecture_drivers_contribution_takes_a_bus
    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def needs(self, agents, question):
        # @righteous architecture_drivers_rank_key_is_a_number
        reason = Reason("tasks.review", DecisionClass.BLOCK, REVIEW_RANK, "a review waits")
        # @sin architecture_drivers_rank_key_is_a_number
        ranked = Reason("tasks.review", DecisionClass.BLOCK, 3, "a review waits")
        return [RequiredState(Working(None, True, reason), REVIEW_RANK, None), ranked]
