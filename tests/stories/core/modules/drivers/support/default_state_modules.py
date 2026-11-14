from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.agent_kind import AgentKind
from engine.enums.state_tier import StateTier
from engine.module.default_state import DefaultState
from engine.module.module import Module
from engine.module.suite import Suite

PATH = "tests.stories.core.modules.drivers.support.default_state_modules"


class AcmeDefault(AgentState):
    """A default state that is open for every hook and gates no rule."""

    name = "acme.default"
    tier = StateTier.IN_PLACE

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [OpenRow("acme", 1, hook.timestamp)]


class GhostDefault(AcmeDefault):
    """A state no module registers."""

    name = "acme.ghost-default"


class DefaultModule(Module):
    name = "acme.default"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]
    agent_states = [AcmeDefault]


class DefaultAdded(Suite):
    name = "acme.default"
    joins = "coding"
    modules = [DefaultModule]
    default_states = [DefaultState(AcmeDefault, AgentKind.ROLE, "main")]


class DefaultNamingUnknownState(Suite):
    name = "acme.ghost-state"
    joins = "coding"
    modules = [DefaultModule]
    default_states = [DefaultState(GhostDefault, AgentKind.ROLE, "main")]


class DefaultNamingUnknownKind(Suite):
    name = "acme.ghost-kind"
    joins = "coding"
    modules = [DefaultModule]
    default_states = [DefaultState(AcmeDefault, AgentKind.DRIVER, "acme.nothing")]
