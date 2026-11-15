from argparse import Namespace

from engine.caller.caller import Caller
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.time.clock import Clock
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.support.driver_settings import BLOCK_CARD_SECONDS

ATTENTION_REASON = "agents the journal cannot move on by itself are few: each waits for its responder"
FAILED_STEP_ATTEMPTS = 3


class DriverAttentionSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal driver attention`: the agents the journal cannot move on by itself: an escalation nobody answered
    past the card's age, a wake that expired, and a step request that failed three times."""

    cli_name = "driver"
    name = "attention"
    empty_line = "no agent waits for anyone's attention"

    def __init__(self, queries: Queries, settings: SettingValues, clock: Clock) -> None:
        self.queries, self.settings, self.clock = queries, settings, clock

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        cutoff = self.clock.timestamp().plus_seconds(-self.settings.number(BLOCK_CARD_SECONDS)).text
        escalations = self.queries.query(AgentEscalation).filter(state=EscalationState.OPEN).matching(Less("created_at", cutoff)).every_row(ATTENTION_REASON)
        wakes = self.queries.query(AgentWake).filter(state=WakeState.EXPIRED).every_row(ATTENTION_REASON)
        requests = self.queries.query(AgentStepRequest).matching(IsNull("served_at")).every_row(ATTENTION_REASON)
        lines = (*(f"agent {row.session_agent_id}: escalation {row.id} to its {row.responder} is not answered" for row in escalations),
                 *(f"agent {row.session_agent_id}: its wake for {row.work_number} expired: {row.failure}" for row in wakes),
                 *(f"agent {row.session_agent_id}: its step failed {row.attempts} times" for row in requests if row.attempts >= FAILED_STEP_ATTEMPTS))
        return lines or tuple([self.empty_line])
