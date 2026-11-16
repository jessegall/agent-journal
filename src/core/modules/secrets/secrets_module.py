from core.modules.secrets.support.secrets_dependencies import SECRETS_DEPENDENCIES
from core.modules.secrets.support.secrets_handlers import SECRETS_HANDLERS
from core.modules.secrets.support.secrets_subcommands import SECRETS_SUBCOMMANDS
from core.modules.secrets.policies.secrets_folder_policy import SecretsFolderPolicy
from core.modules.secrets.windows.secrets_windows import SECRETS_WINDOWS
from core.modules.secrets.models.declarations.secret_model_declaration import SecretModelDeclaration
from core.modules.secrets.skills.declarations.secrets_skills import SECRETS_SKILLS
from core.modules.secrets.migrations.m002_active_secret_index import ActiveSecretIndexMigration
from core.modules.secrets.support.secret_agent_messages import SECRET_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.secrets.guards.secret_value_guard import SecretValueGuard
from core.modules.secrets.listeners.secret_approval_listener import SecretApprovalListener
from core.modules.secrets.migrations.m001_secrets import SecretsTableMigration
from core.modules.secrets.migrations.m003_erased_deleted_secrets import ErasedDeletedSecretsMigration
from core.modules.secrets.seeders.secrets_seeder import SecretsSeeder
from core.modules.secrets.upgrade.secrets_move import SecretsMove


class SecretsModule(Module):
    """Adds secrets: keys and logins the agent gives to programs without seeing them, their values in a file
    outside the project, the Secrets window where the user types them and allows programs, and the guards that
    keep a value out of every tool and row."""

    name = "journal.core.secrets"
    policies = [SecretsFolderPolicy]
    agent_messages = SECRET_AGENT_MESSAGES
    requires_engine = ">=5,<6"
    dependencies = SECRETS_DEPENDENCIES
    skills = SECRETS_SKILLS
    seeders = [SecretsSeeder]
    models = [SecretModelDeclaration]
    migrations = [ActiveSecretIndexMigration, SecretsTableMigration, ErasedDeletedSecretsMigration]
    moves = [SecretsMove]
    handlers = SECRETS_HANDLERS
    subcommands = SECRETS_SUBCOMMANDS
    guards = [SecretValueGuard]
    listeners = [SecretApprovalListener]
    windows = SECRETS_WINDOWS
