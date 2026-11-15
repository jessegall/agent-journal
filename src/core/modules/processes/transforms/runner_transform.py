from engine.enums.transform_slot import TransformSlot
from engine.rule_backed.rule_transform import RuleTransform
from core.modules.processes.rules.runner_rewrite_rule import RunnerRewriteRule


class RunnerTransform(RuleTransform):
    """Wraps a shell line in the journal's runner, as RunnerRewriteRule does today."""

    rule = RunnerRewriteRule
    slot = TransformSlot.RUNNER
    # the runner wraps the line it was given, which is the action judged
    replaces_action = False
