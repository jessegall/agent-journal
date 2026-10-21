from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from journal.features.feature import Feature


@dataclass(frozen=True)
class FeatureData:
    """What the features read about the environment's rows for the agent the state machine asks, one frozen part per feature, read by the feature and typed by the data class the feature names."""

    parts: dict[str, Any]

    def of[D](self, feature: type[Feature[D]]) -> D:
        return self.parts[feature.name]
