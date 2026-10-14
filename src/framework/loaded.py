FEATURES: dict[str, object] = {}
SWITCHED: list = []
SEATED: dict[str, int] = {}


def running(feature: type):
    return FEATURES.get(feature.name)


LOADER: dict = {}
"""What the loader of the features does, filled by that loader when it is imported: a process that names a feature has imported it already."""


def discover() -> None:
    """Imports the module of every feature, so the classes they register are known."""
    LOADER["discover"]()


def load_features(root) -> None:
    """Loads the features as the server loads them."""
    LOADER["load"](root)


def settings_changed(record, names, actor: str) -> None:
    """Tells each feature named that its settings changed: the one funnel the settings write and journal feature configure both use."""
    for name in names:
        if name in FEATURES:
            FEATURES[name].settings_changed(record, actor)
            record.emit("feature", 0, "updated", actor, setting=name)


def switched(record, before: dict, after: dict, actor: str) -> None:
    """Tells each feature whose switch moved which way it went."""
    for name, on in after.items():
        if name in FEATURES and before.get(name) != on:
            FEATURES[name].switched(record, actor, bool(on))


def describe() -> dict:
    return {name: f.describe() for name, f in FEATURES.items()}
