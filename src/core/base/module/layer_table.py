import re

from core.base.module.layer import Layer
from core.base.module.layer_pattern import LayerPattern
from core.base.module.layer_tier import LayerTier

LAYER_PATTERNS = (
    LayerPattern(re.compile(r"src/core/base/"), LayerTier.ENGINE),
    LayerPattern(re.compile(r"src/core/modules/([^/]+)/"), LayerTier.CORE_MODULE),
    LayerPattern(re.compile(r"src/suites/([^/]+)/modules/([^/]+)/"), LayerTier.SUITE_MODULE),
    LayerPattern(re.compile(r"src/suites/([^/]+)/"), LayerTier.SUITE),
    LayerPattern(re.compile(r"src/tunnels/([^/]+)/"), LayerTier.TUNNEL),
    LayerPattern(re.compile(r"src/(server|install)/"), LayerTier.HOST),
)


class LayerTable:
    """Says which layer a source file or an imported module belongs to, from the one list of path patterns."""

    def file_layer(self, relative_path: str) -> Layer | None:
        for pattern in LAYER_PATTERNS:
            match = pattern.expression.match(relative_path)
            if match is not None:
                return Layer(pattern.tier, "/".join(match.groups()) or pattern.tier.value)
        return None

    def import_layer(self, dotted_name: str) -> Layer | None:
        return self.file_layer(f"src/{dotted_name.replace('.', '/')}/")
