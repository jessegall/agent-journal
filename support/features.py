def switched(record, name: str) -> bool:
    from features import FEATURES
    feature_name, _, key = name.partition(".")
    feature = FEATURES.get(feature_name)
    return bool(feature) and bool(feature.on(record, key))
