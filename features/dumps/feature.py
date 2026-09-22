import features.dumps.controller  # noqa: F401
from features.base import Feature
from features.dumps.details import DumpsDetails


class DumpsFeature(Feature):
    details = DumpsDetails
