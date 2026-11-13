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


@pytest.mark.parametrize("kind, component", DEFAULTS.items())
def test_a_kind_gets_its_own_component_when_none_is_declared(kind, component):
    assert SettingComponent.default_for(kind) is component


@pytest.mark.parametrize("kind", DEFAULTS)
def test_the_default_component_of_a_kind_can_draw_that_kind(kind):
    assert kind in SettingComponent.default_for(kind).kinds()


def test_a_component_that_is_no_kind_default_still_names_the_kinds_it_draws():
    assert SettingComponent.THREE_WAY_CAP.kinds() and SettingComponent.PER_TYPE_OVERRIDE.kinds() == tuple([SettingType.NUMBER])
