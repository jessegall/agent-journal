from dataclasses import dataclass


@dataclass(frozen=True)
class FeatureData:
    """What the features read about the environment's rows for the agent the state machine asks, one frozen part per feature, read by the feature."""

    data: dict[str, object]

    def of(self, feature: type) -> object:
        return self.data[feature.name]
