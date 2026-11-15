from engine.enums.transform_slot import TransformSlot
from engine.rule_backed.rule_transform import RuleTransform
from core.modules.aliases.rules.alias_expansion_rule import AliasExpansionRule


class AliasTransform(RuleTransform):
    """Expands an alias into the line it names, as AliasExpansionRule does today."""

    rule = AliasExpansionRule
    slot = TransformSlot.ALIAS
