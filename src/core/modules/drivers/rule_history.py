from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.drivers.rule_sighting import RuleSighting


@dataclass(frozen=True, kw_only=True)
class RuleHistory(Model):
    """What one rule last saw for one agent and layer, and when it last answered with lines or a refusal."""

    model_name = "rule_history"
    cli_name = "rule-history"

    agent_id: int
    creator_id: int
    rule: str
    layer: str = ""
    last_seen: RuleSighting = RuleSighting.ASKED
    last_spoke_at: Timestamp | None = None
