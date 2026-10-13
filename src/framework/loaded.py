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
