from core.modules.accounts.models.declarations.person_login_model_declaration import PersonLoginModelDeclaration
from core.modules.accounts.models.declarations.person_session_model_declaration import PersonSessionModelDeclaration
from core.modules.accounts.models.declarations.login_attempt_model_declaration import LoginAttemptModelDeclaration
from core.modules.accounts.models.declarations.person_factor_model_declaration import PersonFactorModelDeclaration
from core.modules.accounts.models.declarations.recovery_code_model_declaration import RecoveryCodeModelDeclaration
from core.modules.accounts.models.declarations.audit_entry_model_declaration import AuditEntryModelDeclaration
from core.modules.accounts.models.declarations.setup_code_model_declaration import SetupCodeModelDeclaration
from engine.module.module import Module
from core.modules.accounts.guards.account_rows_guard import AccountRowsGuard
from core.modules.accounts.migrations.m001_accounts_tables import AccountsTablesMigration



class AccountsModule(Module):
    """The people who can log in to a hosted journal: their logins, sessions and second factors."""

    name = "journal.core.accounts"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [PersonLoginModelDeclaration, PersonSessionModelDeclaration, LoginAttemptModelDeclaration, PersonFactorModelDeclaration, RecoveryCodeModelDeclaration, AuditEntryModelDeclaration, SetupCodeModelDeclaration]
    guards = [AccountRowsGuard]
    migrations = [AccountsTablesMigration]
    move_reason = "version 4 had no logins, sessions or second factors to carry over"
    seed_reason = "password digests and session tokens are never shown in a demo"
