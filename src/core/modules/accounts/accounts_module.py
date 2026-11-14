from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from core.modules.accounts.guards.account_rows_guard import AccountRowsGuard
from core.modules.accounts.migrations.m001_accounts_tables import AccountsTablesMigration
from core.modules.accounts.models.person_login import PersonLogin
from core.modules.accounts.models.person_session import PersonSession
from core.modules.accounts.models.login_attempt import LoginAttempt
from core.modules.accounts.models.person_factor import PersonFactor
from core.modules.accounts.models.recovery_code import RecoveryCode
from core.modules.accounts.models.audit_entry import AuditEntry
from core.modules.accounts.models.setup_code import SetupCode

HIDDEN_SUBCOMMANDS = ["make", "list", "show", "edit", "delete"]


class AccountsModule(Module):
    """The people who can log in to a hosted journal: their logins, sessions and second factors."""

    name = "journal.core.accounts"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(PersonLogin, excluded_subcommands=HIDDEN_SUBCOMMANDS),
              ModelDeclaration(PersonSession, excluded_subcommands=HIDDEN_SUBCOMMANDS),
              ModelDeclaration(LoginAttempt, excluded_subcommands=HIDDEN_SUBCOMMANDS),
              ModelDeclaration(PersonFactor, excluded_subcommands=HIDDEN_SUBCOMMANDS),
              ModelDeclaration(RecoveryCode, excluded_subcommands=HIDDEN_SUBCOMMANDS),
              ModelDeclaration(AuditEntry, excluded_subcommands=HIDDEN_SUBCOMMANDS),
              ModelDeclaration(SetupCode, excluded_subcommands=HIDDEN_SUBCOMMANDS)]
    guards = [AccountRowsGuard]
    migrations = [AccountsTablesMigration]
    move_reason = "version 4 had no logins, sessions or second factors to carry over"
    seed_reason = "password digests and session tokens are never shown in a demo"
