from enum import Enum


class LayerTier(Enum):
    """The levels of the code from the bottom up; a layer may use its own level and the ones below it."""

    ENGINE = "engine"
    CORE_MODULE = "core module"
    SUITE = "suite"
    SUITE_MODULE = "suite module"
    TUNNEL = "tunnel"
    HOST = "host"

    @property
    def height(self) -> int:
        return TIER_HEIGHTS[self]


TIER_HEIGHTS = {LayerTier.ENGINE: 0, LayerTier.CORE_MODULE: 1, LayerTier.SUITE: 2, LayerTier.SUITE_MODULE: 2, LayerTier.TUNNEL: 2, LayerTier.HOST: 3}
