import re
from dataclasses import dataclass

from engine.module.layer_tier import LayerTier


@dataclass(frozen=True)
class LayerPattern:
    """A path pattern and the tier of the files it matches; the groups of the pattern name the layer."""

    expression: re.Pattern[str]
    tier: LayerTier
