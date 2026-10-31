from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


def test_a_value_is_set_by_the_user_alone_in_both_scopes_unless_it_says_otherwise():
    value = SettingValue("limit", "Limit", "How many rows a list shows.", SettingType.NUMBER, default=50)
    assert (value.agent_writable, value.scope, value.secret) == (False, SettingScope.BOTH, False)


def test_a_group_is_always_on_unless_it_is_toggleable():
    group = SettingGroup("sharing", "Sharing", "Links that show one row.", children=[SettingValue("limit", "Limit", "Rows.", SettingType.NUMBER, default=1)])
    assert (group.toggleable, group.enabled) == (False, True)


def test_a_choice_names_its_choices_and_its_default_is_one_of_them():
    value = SettingValue("face", "Face", "How the viewer looks.", SettingType.CHOICE, default="dark", choices=("dark", "light"))
    assert value.accepts("light") and not value.accepts("blue")


def test_each_type_accepts_only_its_own_values():
    assert SettingValue("n", "N", "A number.", SettingType.NUMBER, default=1).accepts(3)
    assert not SettingValue("n", "N", "A number.", SettingType.NUMBER, default=1).accepts("3")
    assert SettingValue("f", "F", "A flag.", SettingType.FLAG, default=True).accepts(False)
    assert not SettingValue("f", "F", "A flag.", SettingType.FLAG, default=True).accepts(1)
    assert SettingValue("l", "L", "A list.", SettingType.LIST, default=()).accepts(("a", "b"))
