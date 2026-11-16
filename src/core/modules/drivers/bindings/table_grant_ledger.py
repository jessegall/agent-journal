from collections.abc import Mapping, Sequence

from engine.agent_machine.stepping.used_grant import UsedGrant
from engine.agent_machine.stepping.grant import Grant
from engine.agent_machine.stepping.grant_ledger import GrantLedger
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_step.errors.required_effect_error import RequiredEffectError
from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.grant_state import GrantState
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.use_grant.use_grant import UseGrant
from core.modules.drivers.models.used_grant_record import UsedGrantRecord
from core.modules.drivers.models.driver_grant import DriverGrant

GRANTS_REASON = "the open grants of the agents one step reads, a few each"
USABLE_STATES = tuple([GrantState.CONFIRMED, GrantState.APPROVED])
SPENT_TEXT = "the exception this action needs was spent or withdrawn while it was checked"


class TableGrantLedger(GrantLedger):
    """The grant ledger over the driver grant table (doc 1310 section 4.7): a confirmed refusal skip,
    approved where it needs approval, passes the next action its policy refuses; an allowed permission
    passes the action it names; an alias or guard skip passes its exact target. A spend uses the skip and
    permission commands, so their answers stay as they are, and a spent journal command leaves a receipt
    its own entry point takes once."""

    def __init__(self, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.queries, self.repository, self.bus = queries, repository, bus

    def usable_grants(self, agents: Sequence[AgentReference]) -> Mapping[int, Sequence[Grant]]:
        agent_ids = [agent.agent_id for agent in agents]
        granted = self.queries.query(DriverGrant).matching(Among("session_agent_id", agent_ids)).matching(Among("grant_state", USABLE_STATES)).every_row(GRANTS_REASON)
        grants = [self.grant(row) for row in granted if row.grant_state is GrantState.APPROVED or not row.requires_approval]
        return {agent_id: [grant for grant in grants if grant.agent_id == agent_id] for agent_id in agent_ids}

    def open_receipt(self, agent_id: int, command_fingerprint: str, policy_key: str) -> UsedGrant | None:
        row = self.queries.query(UsedGrantRecord).filter(session_agent_id=agent_id, command_fingerprint=command_fingerprint, policy_key=policy_key, consumed_at=None).first()
        return UsedGrant(row.session_agent_id, row.event_id, row.command_fingerprint, row.policy_key, row.grant_id) if row is not None else None

    def spend(self, grant: Grant, event_id: str, command_fingerprint: str, context: Context) -> None:
        if not self.is_spendable(grant):
            raise RequiredEffectError(SPENT_TEXT)
        self.bus.dispatch(UseGrant(grant.grant_id, event_id), context)
        if command_fingerprint:
            self.repository.save(UsedGrantRecord(session_agent_id=grant.agent_id, event_id=event_id, command_fingerprint=command_fingerprint, policy_key=grant.policy_key,
                                            grant_id=grant.grant_id), context)

    # the step read the grant before its write began; the write reads it again, so a grant spent or withdrawn meanwhile admits nothing
    def is_spendable(self, grant: Grant) -> bool:
        return self.queries.query(DriverGrant).find(grant.grant_id).grant_state in USABLE_STATES

    @staticmethod
    def grant(row: DriverGrant) -> Grant:
        return Grant(row.id, row.grant_type, row.policy_key, row.session_agent_id, row.environment_id, row.target, row.action_fingerprint, row.grant_state,
                     row.asker_id, row.responder_id, row.reason, row.tried)
