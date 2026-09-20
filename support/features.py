from features.base import REGISTRY


def switched(record, name: str) -> bool:
    feature_name, _, key = name.partition(".")
    feature = REGISTRY.get(feature_name)
    if not feature or not feature.on_for(record):
        return False
    return bool(record.features.get(name, feature.behaviours[key].default)) if key else True
