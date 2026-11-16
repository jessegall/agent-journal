from collections.abc import Mapping, Sequence

from engine.agent_machine.stepping.used_grant import UsedGrant
from engine.agent_machine.stepping.grant import NEXT_ACTION, Grant
from engine.agent_machine.stepping.grant_ledger import GrantLedger
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_step.errors.required_effect_error import RequiredEffectError
from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.use_permission.use_permission import UsePermission
from core.modules.drivers.commands.use_refusal_skip.use_refusal_skip import UseRefusalSkip
from core.modules.drivers.models.used_grant_record import UsedGrantRecord
from core.modules.drivers.models.driver_grant import DriverGrant
from core.modules.drivers.models.enums.permission_state import PermissionState
from core.modules.drivers.models.permission_request import PermissionRequest
from core.modules.drivers.models.refusal_skip import RefusalSkip

GRANTS_REASON = "the open grants of the agents one step reads, a few each"
USABLE_STATES = tuple([GrantState.CONFIRMED, GrantState.APPROVED])
# a refusal skip and a permission pass their policy whatever the target of the action is
POLICY_TARGET = ""
SPENT_TEXT = "the exception this action needs was spent or withdrawn while it was checked"


class TableGrantLedger(GrantLedger):
    """The grant ledger over the refusal skip, permission request and driver grant tables (doc 1310 section
    4.7): a confirmed refusal skip, approved where it needs approval, passes the next action its policy
    refuses; an allowed permission passes the action it names; an alias or guard skip is a driver_grant row. A
    spend uses the skip and permission commands, so the skip's streak and window and the permission's use stay
    as they are, and a spent journal command leaves a receipt its own entry point takes once."""

    def __init__(self, queries: Queries, repository: Repository, bus: Bus) -> None:
        self.queries, self.repository, self.bus = queries, repository, bus

    def usable_grants(self, agents: Sequence[AgentReference]) -> Mapping[int, Sequence[Grant]]:
        agent_ids = [agent.agent_id for agent in agents]
        environments = {agent.agent_id: agent.environment_id for agent in agents}
        skips = self.queries.query(RefusalSkip).matching(Among("session_agent_id", agent_ids)).filter(used_at=None, cancelled_at=None).every_row(GRANTS_REASON)
        permissions = self.queries.query(PermissionRequest).matching(Among("asker_id", agent_ids)).filter(state=PermissionState.ALLOWED).every_row(GRANTS_REASON)
        granted = self.queries.query(DriverGrant).matching(Among("session_agent_id", agent_ids)).matching(Among("grant_state", USABLE_STATES)).every_row(GRANTS_REASON)
        grants = [*(self.skip_grant(skip, environments[skip.session_agent_id]) for skip in skips if skip.confirmed_at is not None and (not skip.requires_approval or skip.approved_at is not None)),
                  *(self.permission_grant(permission) for permission in permissions), *(self.driver_grant(row) for row in granted)]
        return {agent_id: [grant for grant in grants if grant.agent_id == agent_id] for agent_id in agent_ids}

    def open_receipt(self, agent_id: int, command_fingerprint: str, policy_key: str) -> UsedGrant | None:
        row = self.queries.query(UsedGrantRecord).filter(session_agent_id=agent_id, command_fingerprint=command_fingerprint, policy_key=policy_key, consumed_at=None).first()
        return UsedGrant(row.session_agent_id, row.event_id, row.command_fingerprint, row.policy_key, row.grant_id) if row is not None else None

    def spend(self, grant: Grant, event_id: str, command_fingerprint: str, context: Context) -> None:
        if not self.is_spendable(grant):
            raise RequiredEffectError(SPENT_TEXT)
        if grant.grant_type is GrantType.REFUSAL_SKIP:
            self.bus.dispatch(UseRefusalSkip(grant.grant_id), context)
        elif grant.grant_type is GrantType.PERMISSION:
            self.bus.dispatch(UsePermission(grant.grant_id), context)
        else:
            row = self.queries.query(DriverGrant).find(grant.grant_id)
            self.repository.save_change(row, row.changed(grant_state=GrantState.SPENT, spending_event_id=event_id), context)
        if command_fingerprint:
            self.repository.save(UsedGrantRecord(session_agent_id=grant.agent_id, event_id=event_id, command_fingerprint=command_fingerprint, policy_key=grant.policy_key,
                                            grant_id=grant.grant_id), context)

    # the step read the grant before its write began; the write reads it again, so a grant spent or withdrawn meanwhile admits nothing
    def is_spendable(self, grant: Grant) -> bool:
        if grant.grant_type is GrantType.REFUSAL_SKIP:
            skip = self.queries.query(RefusalSkip).find(grant.grant_id)
            return skip.used_at is None and skip.cancelled_at is None
        if grant.grant_type is GrantType.PERMISSION:
            return self.queries.query(PermissionRequest).find(grant.grant_id).state is PermissionState.ALLOWED
        return self.queries.query(DriverGrant).find(grant.grant_id).grant_state in USABLE_STATES

    @staticmethod
    def skip_grant(skip: RefusalSkip, environment_id: int) -> Grant:
        state = GrantState.APPROVED if skip.approved_at is not None else GrantState.CONFIRMED
        return Grant(skip.id, GrantType.REFUSAL_SKIP, skip.name, skip.session_agent_id, environment_id, POLICY_TARGET, NEXT_ACTION, state, skip.creator_id, None, skip.reason, skip.tried)

    @staticmethod
    def permission_grant(permission: PermissionRequest) -> Grant:
        return Grant(permission.id, GrantType.PERMISSION, permission.action, permission.asker_id, permission.environment_id, POLICY_TARGET, NEXT_ACTION, GrantState.APPROVED,
                     permission.asker_id, permission.responder_id, permission.reason)

    @staticmethod
    def driver_grant(row: DriverGrant) -> Grant:
        return Grant(row.id, row.grant_type, row.policy_key, row.session_agent_id, row.environment_id, row.target, row.action_fingerprint, row.grant_state,
                     row.asker_id, row.responder_id, row.reason, row.tried)
