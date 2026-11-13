from core.modules.secrets.migrations.m002_active_secret_index import ActiveSecretIndexMigration
from engine.skill.skill_declaration import SkillDeclaration
from core.modules.secrets.support.secret_nudges import SECRET_NUDGES
from engine.module.model_declaration import ALL_SUBCOMMANDS, ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_key import WindowKey
from engine.enums.window_place import WindowPlace
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
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery
from core.modules.secrets.rules.secrets_folder_rule import SecretsFolderRule
from core.modules.secrets.seeders.secrets_seeder import SecretsSeeder
from core.modules.secrets.upgrade.secrets_move import SecretsMove
from core.modules.secrets.support.skeletons import SECRETS_SECRETS_SKELETON


class SecretsModule(Module):
    """Adds secrets: keys and logins the agent gives to programs without seeing them, their values in a file
    outside the project, the Secrets window where the user types them and allows programs, and the guards that
    keep a value out of every tool and row."""

    name = "journal.core.secrets"
    nudges = SECRET_NUDGES
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.messages"]
    skills = [SkillDeclaration("journal-secrets", "Use keys and logins without seeing them; read it when a task needs a key or a login", keywords=("secret", "secrets", "api key", "token", "password", "login"), commands=["secret"])]
    seeders = [SecretsSeeder]
    models = [ModelDeclaration(Secret, query=SecretQuery, excluded_subcommands=ALL_SUBCOMMANDS)]
    migrations = [ActiveSecretIndexMigration, SecretsTableMigration, ErasedDeletedSecretsMigration]
    moves = [SecretsMove]
    handlers = [MakeSecretHandler, EditSecretHandler, FillSecretHandler, ProposeProgramHandler, AllowProgramHandler, DeleteSecretHandler]
    subcommands = [MakeSecretSubcommand, RequestSecretSubcommand, EditSecretSubcommand, FillSecretSubcommand, StoreSecretSubcommand, SecretListSubcommand,
                   SecretShowSubcommand, SecretRunSubcommand, ProposeProgramSubcommand, AllowProgramSubcommand, DeleteSecretSubcommand]
    guards = [SecretValueGuard]
    listeners = [SecretApprovalListener]
    driver_rules = [SecretsFolderRule]
    windows = [WindowDeclaration("secrets.secrets", "Secrets", "secrets.js", WindowLoading.COMPONENT, skeleton=SECRETS_SECRETS_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.HASH,
                                 reads=["secret list", "secret show"], keys=[WindowKey("secrets", "secret list", events=["secret.*"])], runs=["secret fill", "secret allow", "secret make", "secret update", "secret delete"], events=["secret.*"])]
