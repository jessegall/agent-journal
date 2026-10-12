FEATURES: dict[str, object] = {}
SWITCHED: list = []
SEATED: dict[str, int] = {}


def running(feature: type):
    return FEATURES.get(feature.name)
