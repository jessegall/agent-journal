from engine.agent.groups.agent_group import AgentGroup
from engine.module.module import Module
from suites.coding.agent_groups.designer_group import DesignerGroup
from suites.coding.coding_module import CodingModule


class CashiersGroup(AgentGroup):
    key = "cashiers"
    label = "Cashiers"
    agent_type = "helper"
    profiles = tuple(["shop-cashier"])


class ShopModule(Module):
    name = "shop"
    agent_groups = [CashiersGroup, AgentGroup("stockers", "Stockers", "worker")]


def test_a_group_class_gives_the_group_the_inline_call_gave():
    assert CashiersGroup.declared() == AgentGroup("cashiers", "Cashiers", "helper", tuple(["shop-cashier"]))


def test_a_module_gives_the_declarations_of_its_group_classes_beside_its_inline_ones():
    assert [group.key for group in ShopModule.group_declarations()] == ["cashiers", "stockers"]


def test_the_coding_module_lists_its_four_groups_as_classes_with_the_designer_on_its_profile():
    assert [group.key for group in CodingModule.group_declarations()] == ["workers", "merger", "designer", "helpers"]
    assert DesignerGroup.declared().profiles == tuple(["journal-designer"])
