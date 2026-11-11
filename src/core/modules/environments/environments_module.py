from engine.environment.environment_names import EnvironmentNames
from core.modules.environments.bindings.environment_table_names import EnvironmentTableNames
from core.modules.environments.guards.environment_grant_guard import EnvironmentGrantGuard
from core.modules.environments.migrations.m001_environments import EnvironmentsTableMigration
from core.modules.environments.migrations.m002_test_environments import TestEnvironmentsMigration
from engine.module.module import Module
from engine.module.model_declaration import ModelDeclaration
from core.modules.environments.models.environment import Environment
from core.modules.environments.queries.environment_query import EnvironmentQuery
from core.modules.environments.seeders.environments_seeder import EnvironmentsSeeder
from core.modules.environments.upgrade.environments_move import EnvironmentsMove
from core.modules.environments.commands.environment_list.environment_list_subcommand import EnvironmentListSubcommand


class EnvironmentsModule(Module):
    """Adds environments, the checkouts where work happens, and lets --environment name one."""

    name = "journal.core.environments"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors"]
    models = [ModelDeclaration(Environment, query=EnvironmentQuery, excluded_subcommands=["list"])]
    subcommands = [EnvironmentListSubcommand]
    migrations = [EnvironmentsTableMigration, TestEnvironmentsMigration]
    guards = [EnvironmentGrantGuard]
    bindings = {EnvironmentNames: EnvironmentTableNames}
    seeders = [EnvironmentsSeeder]
    moves = [EnvironmentsMove]
