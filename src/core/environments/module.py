from core.base.module.module import Module
from core.base.module.noun import Noun
from core.environments.environment import Environment


class EnvironmentsModule(Module):
    """Adds environments, the checkouts where work happens, and lets --environment name one."""

    name = "environments"
    requires_core = ">=5,<6"
    dependencies = ("actors",)
    nouns = (Noun(Environment),)
    migrations = ("core.environments.migrations.m001_environments:EnvironmentsTable",)
    bindings = (("core.base.environment_names:EnvironmentNames", "core.environments.environment_table_names:EnvironmentTableNames"),)
