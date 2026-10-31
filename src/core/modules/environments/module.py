from core.base.environment_names import EnvironmentNames
from core.modules.environments.environment_table_names import EnvironmentTableNames
from core.modules.environments.migrations.m001_environments import EnvironmentsTable
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.environments.environment import Environment


class EnvironmentsModule(Module):
    """Adds environments, the checkouts where work happens, and lets --environment name one."""

    name = "environments"
    requires_core = ">=5,<6"
    dependencies = ["actors"]
    models = [ModelDeclaration(Environment)]
    migrations = [EnvironmentsTable]
    bindings = [(EnvironmentNames, EnvironmentTableNames)]
