from core.base.setting.list_rule import ListRule
from core.base.setting.number_rule import NumberRule
from core.base.setting.ruled_settings import ruled_settings
from core.base.setting.setting_rule import SettingRuleText
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


def test_a_rule_written_as_text_checks_a_value_like_the_rule():
    written = SettingRuleText.to_text(NumberRule(0, maximum=100))
    assert not list(SettingRuleText().problems(written, "percent", 100))
    assert list(SettingRuleText().problems(written, "percent", 101))
    assert list(SettingRuleText().problems(written, "percent", 2.5))


def test_a_list_rule_keeps_its_choices_through_the_text():
    written = SettingRuleText.to_text(ListRule(choices=("read", "edit")))
    assert not list(SettingRuleText().problems(written, "types", ["read"]))
    assert list(SettingRuleText().problems(written, "types", ["deploy"]))


def test_no_rule_accepts_every_value():
    assert SettingRuleText.to_text(None) == ""
    assert not list(SettingRuleText().problems("", "any", object()))


def test_ruled_settings_attach_a_rule_by_full_key_and_leave_the_others():
    values = [SettingValue("limit", "Limit", "A limit.", SettingType.NUMBER, default=1), SettingValue("name", "Name", "A name.", SettingType.TEXT, default="")]
    ruled = ruled_settings("journal.test", values, {"journal.test.limit": NumberRule(1)})
    assert [value.rule for value in ruled] == [NumberRule(1), None]
    assert ruled[0].declaration().rule == SettingRuleText.to_text(NumberRule(1))
