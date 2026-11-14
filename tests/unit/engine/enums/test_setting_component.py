import pytest

from engine.enums.setting_component import SettingComponent
from engine.enums.setting_type import SettingType

DEFAULTS = {
    SettingType.FLAG: SettingComponent.TOGGLE,
    SettingType.NUMBER: SettingComponent.NUMBER,
    SettingType.CHOICE: SettingComponent.CHOICE,
    SettingType.LIST: SettingComponent.ENTRY_LIST,
    SettingType.NUMBER_LIST: SettingComponent.NUMBER_LIST,
    SettingType.TEXT: SettingComponent.TEXT,
}


@pytest.mark.parametrize("category, component", DEFAULTS.items())
def test_a_kind_gets_its_own_component_when_none_is_declared(category, component):
    assert SettingComponent.default_component(category) is component


@pytest.mark.parametrize("category", DEFAULTS)
def test_the_default_component_of_a_kind_can_draw_that_kind(category):
    assert category in SettingComponent.default_component(category).categories()


def test_a_component_that_is_no_kind_default_still_names_the_kinds_it_draws():
    assert SettingComponent.TRIPLE_CAP.categories() and SettingComponent.TYPE_OVERRIDE.categories() == tuple([SettingType.NUMBER])
