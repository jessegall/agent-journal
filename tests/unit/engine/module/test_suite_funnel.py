import pytest

from engine.driver.agent_state import AgentState
from engine.enums.agent_kind import AgentKind
from engine.module.default_state import DefaultState
from engine.module.errors.module_error import ModuleError
from engine.module.suite import Suite
from engine.module.suite_funnel import SuiteFunnel
from engine.module.suite_list import SuiteList
from engine.registry.default_state_entry import DefaultStateEntry


class LoadingState(AgentState):
    name = "samples.loading"


class UnregisteredState(AgentState):
    name = "samples.unregistered"


class ShopSuite(Suite):
    name = "shop"
    default_states = [DefaultState(LoadingState, AgentKind.ROLE, "helper"), DefaultState(LoadingState, AgentKind.DRIVER, "shop.main")]


class JoiningSuite(Suite):
    name = "shop-extra"
    joins = "shop"
    default_states = [DefaultState(LoadingState, AgentKind.HELPER_TYPE, "shop.reviewer", "samples.done")]


def funnel(*suites: type[Suite]) -> SuiteFunnel:
    return SuiteFunnel(SuiteList(suites), ["samples.loading"], ["shop.main"], ["shop.reviewer"])


def test_a_suite_and_the_suites_that_join_it_give_their_default_states():
    assert funnel(ShopSuite, JoiningSuite).entries(ShopSuite) == (DefaultStateEntry("samples.loading", AgentKind.ROLE, "helper"),
                                                                  DefaultStateEntry("samples.loading", AgentKind.DRIVER, "shop.main"),
                                                                  DefaultStateEntry("samples.loading", AgentKind.HELPER_TYPE, "shop.reviewer", "samples.done"))


def test_a_default_naming_a_state_no_module_registers_is_refused():
    suite = type("Stray", tuple([Suite]), {"name": "stray", "default_states": [DefaultState(UnregisteredState, AgentKind.ROLE, "helper")]})
    with pytest.raises(ModuleError) as refused:
        funnel(suite).entries(suite)
    assert str(refused.value) == "suite stray gives the default state samples.unregistered, which no module registers"


@pytest.mark.parametrize("kind,value", [(AgentKind.ROLE, "pilot"), (AgentKind.DRIVER, "shop.other"), (AgentKind.HELPER_TYPE, "shop.critic")])
def test_a_default_for_a_role_driver_or_helper_type_nothing_registers_is_refused(kind, value):
    suite = type("Stray", tuple([Suite]), {"name": "stray", "default_states": [DefaultState(LoadingState, kind, value)]})
    with pytest.raises(ModuleError) as refused:
        funnel(suite).entries(suite)
    assert str(refused.value) == f"suite stray gives a default state to the {kind.value} {value}, which nothing registers"


def test_a_default_matches_an_agent_by_its_role_driver_or_helper_type():
    by_role, by_driver, by_type = (DefaultStateEntry("s", AgentKind.ROLE, "helper"), DefaultStateEntry("s", AgentKind.DRIVER, "shop.main"),
                                   DefaultStateEntry("s", AgentKind.HELPER_TYPE, "shop.reviewer"))
    assert [entry.matches("helper", "shop.main", "") for entry in (by_role, by_driver, by_type)] == [True, True, False]
    assert by_type.matches("helper", "shop.helper", "shop.reviewer")
