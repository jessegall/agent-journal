from core.base.environment_names import EnvironmentNames
from core.modules.environments.environment_table_names import EnvironmentTableNames
from core.modules.environments.migrations.m001_environments import EnvironmentsTable
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.environments.environment import Environment
from core.modules.environments.environment_query import EnvironmentQuery


class EnvironmentsModule(Module):
    """Adds environments, the checkouts where work happens, and lets --environment name one."""

    name = "environments"
    requires_core = ">=5,<6"
    dependencies = ["actors"]
    models = [ModelDeclaration(Environment, query=EnvironmentQuery)]
    migrations = [EnvironmentsTable]
    bindings = [(EnvironmentNames, EnvironmentTableNames)]
