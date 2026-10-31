from collections.abc import Sequence

from core.base.driver.rule_record import RuleRecord
from core.base.driver.layer import Layer
from core.base.driver.overlay import Overlay
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_outcome import SILENCED, RuleOutcome
from core.base.registry.driver_rule_entry import DriverRuleEntry


class Walk:
    """One hook's walk through its rules: the rules asked and passed over, whether an exclusive layer silences what
    follows, and whether the newest layer holds lines."""

    def __init__(self, layers: Sequence[str]) -> None:
        self.layers = list(layers)
        self.rules: list[RuleRecord] = []
        self.is_silenced = False
        self.layer_ended = False
        self.holds_lines = False

    def record(self, entry: DriverRuleEntry, layer: str, outcome: RuleOutcome) -> bool:
        self.rules.append(RuleRecord(entry.name, layer, outcome.outcome, outcome.answer))
        self.layer_ended = self.layer_ended or (outcome.answer is not None and outcome.answer.ends_layer)
        return outcome.answer is not None and outcome.answer.last and outcome.outcome != "raised"

    def record_silenced(self, entry: DriverRuleEntry, layer: str) -> None:
        self.rules.append(RuleRecord(entry.name, layer, SILENCED))

    def leave_layer(self, layer: Layer, overlay: type[Overlay]) -> None:
        if not self.layers or self.layers[0] == layer.row.ref:
            self.holds_lines = overlay.holds_lines and not self.layer_ended
        self.is_silenced = self.is_silenced or (overlay.exclusive and not self.layer_ended)
        self.layer_ended = False

    def answers(self) -> RuleAnswers:
        return RuleAnswers(self.layers, self.rules, self.holds_lines)
