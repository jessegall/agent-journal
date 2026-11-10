from enum import Enum


class LayerTier(Enum):
    """The levels of the code from the bottom up; a layer may use its own level and the ones below it. The test kit
    is the top: it may use every layer and only tests use it."""

    ENGINE = "engine"
    CORE_MODULE = "core module"
    SUITE = "suite"
    SUITE_MODULE = "suite module"
    TUNNEL = "tunnel"
    HOST = "host"
    MODULE_LIST = "module list"
    TEST_KIT = "test kit"

    @property
    def height(self) -> int:
        return TIER_HEIGHTS[self]


TIER_HEIGHTS = {LayerTier.ENGINE: 0, LayerTier.CORE_MODULE: 1, LayerTier.SUITE: 2, LayerTier.SUITE_MODULE: 2, LayerTier.TUNNEL: 2, LayerTier.HOST: 3, LayerTier.MODULE_LIST: 3, LayerTier.TEST_KIT: 4}
