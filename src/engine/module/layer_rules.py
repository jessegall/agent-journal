from collections.abc import Sequence

from engine.module.layer import Layer
from engine.module.layer_table import LayerTable
from engine.module.layer_tier import LayerTier
from engine.module.module import Module

ENGINE_LAYER = Layer(LayerTier.ENGINE, LayerTier.ENGINE.value)
PUBLIC_FOLDER_TIERS = (LayerTier.SUITE, LayerTier.SUITE_MODULE, LayerTier.TUNNEL)


class LayerRules:
    """Works out which layers each layer may import from what its module declares: down and sideways, never up."""

    def __init__(self, table: LayerTable, modules: Sequence[type[Module]]) -> None:
        self.layer_by_module = {module.name: layer for module in modules if (layer := table.import_layer(module.__module__)) is not None}
        self.dependencies_by_layer = {self.layer_by_module[module.name]: module.dependencies for module in modules if module.name in self.layer_by_module}

    def allowed(self, layer: Layer) -> set[Layer]:
        if layer.tier is LayerTier.ENGINE:
            return {ENGINE_LAYER}
        if layer.tier is LayerTier.HOST:
            return {layer, ENGINE_LAYER, *(module_layer for module_layer in self.layer_by_module.values() if module_layer.tier is LayerTier.CORE_MODULE)}
        return {layer, ENGINE_LAYER, *self.declared_layers(layer)}

    def declared_layers(self, layer: Layer) -> list[Layer]:
        return [self.layer_by_module[name] for name in self.dependencies_by_layer.get(layer, []) if name in self.layer_by_module]

    def uses_public_folders(self, importer: Layer, target: Layer) -> bool:
        return importer.tier in PUBLIC_FOLDER_TIERS and target.tier is LayerTier.CORE_MODULE

    def table_lines(self) -> list[str]:
        layers = sorted({ENGINE_LAYER, *self.dependencies_by_layer}, key=lambda layer: (layer.tier.height, layer.label))
        return [f"{layer.label} may use: {', '.join(self.allowed_labels(layer))}" for layer in layers]

    def allowed_labels(self, layer: Layer) -> list[str]:
        targets = sorted(self.allowed(layer) - {layer}, key=lambda target: (target.tier.height, target.label))
        return [f"{target.label} (public folders)" if self.uses_public_folders(layer, target) else target.label for target in targets]
