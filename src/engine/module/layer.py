from dataclasses import dataclass

from engine.enums.layer_tier import LayerTier


@dataclass(frozen=True)
class Layer:
    """One part of the source whose imports are checked: the engine, a module, a suite, a tunnel, the host or a file
    that lists the modules of a top folder."""

    tier: LayerTier
    name: str

    @property
    def label(self) -> str:
        return self.tier.value if self.name == self.tier.value else f"{self.tier.value} {self.name}"
