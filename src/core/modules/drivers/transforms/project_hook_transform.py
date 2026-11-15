from engine.enums.transform_slot import TransformSlot
from engine.rule_backed.rule_transform import RuleTransform
from core.modules.drivers.rules.foreign_hooks_rule import ForeignHooksRule


class ProjectHookTransform(RuleTransform):
    """The input a project's own hook gave back, as ForeignHooksRule passes it on today."""

    rule = ForeignHooksRule
    slot = TransformSlot.PROJECT_HOOK
