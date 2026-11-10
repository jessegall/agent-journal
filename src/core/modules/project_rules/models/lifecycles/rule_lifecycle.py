from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from core.modules.project_rules.models.enums.rule_state import RuleState


class RuleLifecycle(Lifecycle):
    """A rule starts active or proposed; a person approves or denies a proposed one, and an active one can go."""

    states = RuleState
    initial = [RuleState.ACTIVE, RuleState.PROPOSED]
    editable = [RuleState.PROPOSED, RuleState.ACTIVE]
    deletable = [RuleState.DENIED, RuleState.REMOVED]

    approve = Move("approve", [RuleState.PROPOSED], RuleState.ACTIVE)
    deny = Move("deny", [RuleState.PROPOSED], RuleState.DENIED)
    remove = Move("remove", [RuleState.ACTIVE], RuleState.REMOVED)
