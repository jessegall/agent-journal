from engine.enums.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.accounts.models.audit_entry import AuditEntry
from core.modules.accounts.models.login_attempt import LoginAttempt
from core.modules.accounts.models.person_factor import PersonFactor
from core.modules.accounts.models.person_login import PersonLogin
from core.modules.accounts.models.person_session import PersonSession
from core.modules.accounts.models.recovery_code import RecoveryCode
from core.modules.accounts.models.setup_code import SetupCode

AccountRowChange = (Changed[PersonLogin] | Changed[PersonSession] | Changed[PersonFactor] | Changed[RecoveryCode]
                    | Changed[LoginAttempt] | Changed[AuditEntry] | Changed[SetupCode])


class AccountRowsGuard(Guard[AccountRowChange]):
    """Lets only the journal itself write a login, a session, a second factor, a recovery code, a login attempt,
    an audit entry or a setup code, so no agent and no person can change who may log in."""

    name = "accounts.account-rows"
    is_safety = True

    def check(self, event: AccountRowChange, context: Context) -> None:
        if context.actor.type is not ActorType.CORE:
            raise Refusal("accounts are written only by the journal itself")
