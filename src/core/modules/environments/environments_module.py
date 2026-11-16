from core.modules.environments.models.declarations.environment_model_declaration import EnvironmentModelDeclaration
from engine.environment.environment_names import EnvironmentNames
from core.modules.environments.bindings.environment_table_names import EnvironmentTableNames
from core.modules.environments.guards.environment_grant_guard import EnvironmentGrantGuard
from core.modules.environments.migrations.m001_environments import EnvironmentsTableMigration
from core.modules.environments.migrations.m002_test_environments import TestEnvironmentsMigration
from engine.module.module import Module
from core.modules.environments.seeders.environments_seeder import EnvironmentsSeeder
from core.modules.environments.upgrade.environments_move import EnvironmentsMove
from core.modules.environments.commands.environment_list.environment_list_subcommand import EnvironmentListSubcommand
from core.modules.environments.migrations.m003_environment_test_agent_reference import EnvironmentTestAgentReferenceMigration


class EnvironmentsModule(Module):
    """Adds environments, the checkouts where work happens, and lets --environment name one."""

    name = "journal.core.environments"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.actors"]
    models = [EnvironmentModelDeclaration]
    subcommands = [EnvironmentListSubcommand]
    migrations = [EnvironmentTestAgentReferenceMigration, EnvironmentsTableMigration, TestEnvironmentsMigration]
    guards = [EnvironmentGrantGuard]
    bindings = {EnvironmentNames: EnvironmentTableNames}
    seeders = [EnvironmentsSeeder]
    moves = [EnvironmentsMove]
