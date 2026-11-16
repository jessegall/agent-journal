from core.modules.accounts.declarations.accounts_models import ACCOUNTS_MODELS
from engine.module.module import Module
from core.modules.accounts.guards.account_rows_guard import AccountRowsGuard
from core.modules.accounts.migrations.m001_accounts_tables import AccountsTablesMigration



class AccountsModule(Module):
    """The people who can log in to a hosted journal: their logins, sessions and second factors."""

    name = "journal.core.accounts"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.actors"]
    models = ACCOUNTS_MODELS
    guards = [AccountRowsGuard]
    migrations = [AccountsTablesMigration]
    move_reason = "version 4 had no logins, sessions or second factors to carry over"
    seed_reason = "password digests and session tokens are never shown in a demo"
