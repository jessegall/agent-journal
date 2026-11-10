from engine.setting.list_rule import ListRule
from engine.setting.number_rule import NumberRule

SettingRule = NumberRule | ListRule
RULE_TYPES = {NumberRule.name: NumberRule, ListRule.name: ListRule}
RULE_NAME = "rule"
