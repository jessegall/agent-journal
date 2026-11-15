from core.modules.secrets.policies.secrets_folder_policy import SecretsFolderPolicy
from core.modules.secrets.windows.secrets_windows import SECRETS_WINDOWS
from core.modules.secrets.models.declarations.secret_model_declaration import SecretModelDeclaration
from core.modules.secrets.skills.declarations.secrets_skills import SECRETS_SKILLS
from core.modules.secrets.migrations.m002_active_secret_index import ActiveSecretIndexMigration
from core.modules.secrets.support.secret_agent_messages import SECRET_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.secrets.commands.allow_program.allow_program_handler import AllowProgramHandler
from core.modules.secrets.commands.delete_secret.delete_secret_handler import DeleteSecretHandler
from core.modules.secrets.commands.edit_secret.edit_secret_handler import EditSecretHandler
from core.modules.secrets.commands.fill_secret.fill_secret_handler import FillSecretHandler
from core.modules.secrets.commands.make_secret.make_secret_handler import MakeSecretHandler
from core.modules.secrets.commands.propose_program.propose_program_handler import ProposeProgramHandler
from core.modules.secrets.commands.allow_program.allow_program_subcommand import AllowProgramSubcommand
from core.modules.secrets.commands.delete_secret.delete_secret_subcommand import DeleteSecretSubcommand
from core.modules.secrets.commands.fill_secret.fill_secret_subcommand import FillSecretSubcommand
from core.modules.secrets.commands.secret_list.secret_list_subcommand import SecretListSubcommand
from core.modules.secrets.commands.make_secret.make_secret_subcommand import MakeSecretSubcommand
from core.modules.secrets.commands.propose_program.propose_program_subcommand import ProposeProgramSubcommand
from core.modules.secrets.commands.request_secret.request_secret_subcommand import RequestSecretSubcommand
from core.modules.secrets.commands.secret_run.secret_run_subcommand import SecretRunSubcommand
from core.modules.secrets.commands.secret_show.secret_show_subcommand import SecretShowSubcommand
from core.modules.secrets.commands.store_secret.store_secret_subcommand import StoreSecretSubcommand
from core.modules.secrets.commands.edit_secret.edit_secret_subcommand import EditSecretSubcommand
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
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.messages"]
    skills = SECRETS_SKILLS
    seeders = [SecretsSeeder]
    models = [SecretModelDeclaration]
    migrations = [ActiveSecretIndexMigration, SecretsTableMigration, ErasedDeletedSecretsMigration]
    moves = [SecretsMove]
    handlers = [MakeSecretHandler, EditSecretHandler, FillSecretHandler, ProposeProgramHandler, AllowProgramHandler, DeleteSecretHandler]
    subcommands = [MakeSecretSubcommand, RequestSecretSubcommand, EditSecretSubcommand, FillSecretSubcommand, StoreSecretSubcommand, SecretListSubcommand,
                   SecretShowSubcommand, SecretRunSubcommand, ProposeProgramSubcommand, AllowProgramSubcommand, DeleteSecretSubcommand]
    guards = [SecretValueGuard]
    listeners = [SecretApprovalListener]
    windows = SECRETS_WINDOWS
