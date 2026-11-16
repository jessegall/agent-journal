from enum import StrEnum

from engine.chat.dock_declaration import DockDeclaration
from engine.enums.setting_type import SettingType
from engine.module.module import Module
from engine.setting.number_rule import NumberRule
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_list import SettingList
from engine.setting.setting_value import SettingValue

SHELF_GROUP = SettingGroup("shelves", "Shelves", "How the shelves are kept", children=(SettingValue("height", "Height", "How high a shelf is", SettingType.NUMBER, default=2),))


class ShopDockType(StrEnum):
    ORDER = "shop.order"


class OrderDock(DockDeclaration):
    type = ShopDockType.ORDER
    icon = "cart"
    title = "{row_title}"
    most = 3


class ShopSettingValues(SettingList):
    module_key = "shop"
    values = [SettingValue("till-count", "Tills", "How many tills are open", SettingType.NUMBER, default=1)]
    groups = [SHELF_GROUP]
    rules = {"shop.till-count": NumberRule(1)}


class ShopModule(Module):
    name = "shop"
    settings = [ShopSettingValues, SettingValue("open", "Open", "Whether the shop is open", SettingType.FLAG, default=True)]
    docks = [OrderDock]


def test_a_setting_list_gives_its_values_with_their_rules_and_its_groups():
    assert ShopSettingValues.nodes() == [SettingValue("till-count", "Tills", "How many tills are open", SettingType.NUMBER, default=1, rule=NumberRule(1)), SHELF_GROUP]


def test_a_module_gives_the_nodes_of_its_setting_lists_beside_its_inline_ones():
    assert [node.key for node in ShopModule.setting_nodes()] == ["till-count", "shelves", "open"]


def test_a_dock_class_gives_the_dock_the_inline_call_gave():
    assert ShopModule.dock_declarations() == [DockDeclaration(ShopDockType.ORDER, "cart", "{row_title}", most=3)]
