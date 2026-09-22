import features.collections.controller  # noqa: F401
from features.base import Feature
from features.collections.details import CollectionsDetails


class CollectionsFeature(Feature):
    details = CollectionsDetails
