FEATURES: dict[str, object] = {}
SWITCHED: list = []
SEATED: dict[str, int] = {}


def running(feature: type):
    return FEATURES.get(feature.name)


def discover() -> None:
    """Imports the module of every feature, so the classes they register are known."""
    from features import discover as found
    found()
