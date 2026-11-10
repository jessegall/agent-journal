from collections.abc import Sequence

from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_record import RuleRecord
from core.base.driver.layer import Layer
from core.base.driver.overlay import Overlay
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_outcome import RAISED, SILENCED, RuleOutcome
from engine.registry.driver_rule_entry import DriverRuleEntry


class Walk:
    """One hook's walk through its rules: the rules asked and silenced, whether an exclusive layer silences
    what follows, and whether the newest layer holds lines."""

    def __init__(self, layers: Sequence[str]) -> None:
        self.layers = list(layers)
        self.rules: list[RuleRecord] = []
        self.is_silenced = False
        self.holds_wakes = False
        self.delays_notices = False
        self.is_paused = False
        self.has_ended_layer = False
        self.delays_lines = False

    def record(self, entry: DriverRuleEntry, layer: str, outcome: RuleOutcome) -> bool:
        self.rules.append(RuleRecord(entry.name, layer, outcome.outcome, outcome.answer, entry.history, reason=outcome.line))
        self.has_ended_layer = self.has_ended_layer or (outcome.answer is not None and outcome.answer.ends_layer)
        return outcome.answer is not None and outcome.answer.last and outcome.outcome != RAISED

    def record_silenced(self, entry: DriverRuleEntry, layer: str) -> None:
        self.rules.append(RuleRecord(entry.name, layer, SILENCED, history=entry.history))

    def leave_layer(self, layer: Layer, overlay: type[Overlay]) -> None:
        if not self.layers or self.layers[0] == layer.row.ref:
            self.delays_lines = overlay.delays_lines and not self.has_ended_layer
        self.is_silenced = self.is_silenced or (overlay.exclusive and not self.has_ended_layer)
        self.holds_wakes = self.holds_wakes or (overlay.exclusive and not overlay.allows_wakes and not self.has_ended_layer)
        self.delays_notices = self.delays_notices or (overlay.delays_notices and not self.has_ended_layer)
        self.is_paused = self.is_paused or (overlay.pauses_agent and not self.has_ended_layer)
        self.has_ended_layer = False

    def silences(self, rule: type[DriverRule]) -> bool:
        if rule.wakes_agent:
            return self.holds_wakes
        return (self.is_silenced and not rule.overlay_proof) or (self.is_paused and rule.yields_to_pause) or (self.delays_notices and rule.is_notice)

    def answers(self) -> RuleAnswers:
        return RuleAnswers(self.layers, self.rules, self.delays_lines)
