from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.contracts.agent_plan_states import AgentPlanStates
from engine.agent_machine.states.block_plan import BlockPlan
from engine.enums.closer_role import CloserRole
from engine.query.queries import Queries
from core.modules.helpers.agent_messages.steer_unanswered_message import SteerUnansweredMessage
from core.modules.helpers.agent_messages.steer_unanswered_stop_message import SteerUnansweredStopMessage
from core.modules.helpers.models.helper_steer import HelperSteer
from core.modules.helpers.states.job_work_states import HELPER_TYPE
from core.modules.helpers.support.block_conditions.steers_answered import SteersAnswered

STEER_RANK = "helpers.steer"
TOOL_KEY, STOP_KEY = "helpers.steer-unanswered", "helpers.steer-unanswered-at-stop"
ANSWER_COMMANDS = ("journal helper answer-steer", "journal helper-steer", "journal helper --help", "journal overview")


class SteerStates(AgentPlanStates):
    """Plans the block of the steers a helper's parent added to its open job and it has not answered: every
    tool at once, reads too, and its stop, so its report waits for its answer; the answer, a read of the
    steer, the helper command's help and the overview pass."""
    state_type = Blocked
    rank = STEER_RANK
    agent_types = [HELPER_TYPE]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def plan(self, agent_id: int) -> BlockPlan | None:
        steers = self.queries.query(HelperSteer).filter(helper_id=agent_id, answer=None).oldest().get()
        if not steers:
            return None
        ids = tuple(steer.id for steer in steers)
        return BlockPlan(SteerUnansweredMessage.declared().agent_message(steer=ids[0]), SteersAnswered(ids), TOOL_KEY, STEER_RANK, stop_check_key=STOP_KEY,
                         members=ids, scope_stop=True, is_strict=True, closer_roles=(CloserRole.AGENT,), lifting_lines=ANSWER_COMMANDS,
                         stop_agent_message=SteerUnansweredStopMessage.declared().agent_message(steer=ids[0]))
