from engine.setting.list_rule import ListRule
from engine.setting.number_rule import NumberRule
from engine.setting.ruled_settings import ruled_settings
from engine.setting.setting_rule_text import SettingRuleText
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue


def test_a_rule_written_as_text_checks_a_value_like_the_rule():
    saved = SettingRuleText.rule_text(NumberRule(0, maximum=100))
    assert not list(SettingRuleText().problems(saved, "percent", 100))
    assert list(SettingRuleText().problems(saved, "percent", 101))
    assert list(SettingRuleText().problems(saved, "percent", 2.5))


def test_a_list_rule_keeps_its_choices_through_the_text():
    saved = SettingRuleText.rule_text(ListRule(choices=("read", "edit")))
    assert not list(SettingRuleText().problems(saved, "types", ["read"]))
    assert list(SettingRuleText().problems(saved, "types", ["deploy"]))


def test_no_rule_accepts_every_value():
    assert SettingRuleText.rule_text(None) == ""
    assert not list(SettingRuleText().problems("", "any", object()))


def test_ruled_settings_attach_a_rule_by_full_key_and_leave_the_others():
    values = [SettingValue("limit", "Limit", "A limit.", SettingType.NUMBER, default=1), SettingValue("name", "Name", "A name.", SettingType.TEXT, default="")]
    ruled = ruled_settings("journal.test", values, {"journal.test.limit": NumberRule(1)})
    assert [value.rule for value in ruled] == [NumberRule(1), None]
    assert ruled[0].declaration().rule == SettingRuleText.rule_text(NumberRule(1))
