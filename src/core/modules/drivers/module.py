from core.base.driver.hook_history import HookHistory
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.drivers.agent_line import AgentLine
from core.modules.drivers.hook_call import HookCall
from core.modules.drivers.hook_call_query import HookCallQuery
from core.modules.drivers.migrations.m001_drivers import DriversTables
from core.modules.drivers.rule_history import RuleHistory
from core.modules.drivers.table_hook_history import TableHookHistory


class DriversModule(Module):
    """Keeps every hook's decision, the lines waiting for agents and the rules' history, and answers hooks through
    the suites, drivers and rules of the installed modules."""

    name = "journal.core.drivers"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.settings"]
    models = [ModelDeclaration(HookCall, query=HookCallQuery, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(AgentLine), ModelDeclaration(RuleHistory, excluded_subcommands=["make", "edit"])]
    migrations = [DriversTables]
    bindings = [(HookHistory, TableHookHistory)]
