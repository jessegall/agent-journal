from features.base import REGISTRY


def switched(record, name: str) -> bool:
    feature = REGISTRY.get(name)
    return bool(feature) and feature.on_for(record)
