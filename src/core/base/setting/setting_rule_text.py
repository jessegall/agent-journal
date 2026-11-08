import json
from collections.abc import Iterator
from dataclasses import asdict

from core.base.setting.list_rule import ListRule
from core.base.setting.setting_rule import RULE_NAME, RULE_TYPES, SettingRule


class SettingRuleText:
    """A setting rule kept as JSON text in the registry, so a declared rule survives the stored registry: it
    writes a rule as text and checks a value against the rule in a text."""

    @staticmethod
    def rule_text(rule: SettingRule | None) -> str:
        return "" if rule is None else json.dumps({RULE_NAME: rule.name, **asdict(rule)})

    def problems(self, text: str, key: str, value: object) -> Iterator[str]:
        if not text:
            return
        fields = json.loads(text)
        rule_type = RULE_TYPES[fields.pop(RULE_NAME)]
        if rule_type is ListRule:
            fields["choices"] = tuple(fields["choices"])
        yield from rule_type(**fields).problems(key, value)
