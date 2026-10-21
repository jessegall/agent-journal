from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from journal.events.data_source import DataSource


@dataclass(frozen=True)
class FeatureData:
    """What the features read about the environment's rows for the agent the state machine asks, one frozen part per feature, read by the feature and typed by the data class the feature names."""

    parts: Mapping[str, Any]

    def part[D](self, source: type[DataSource[D]]) -> D:
        return self.parts[source.name] if source.name in self.parts else source.missing()
