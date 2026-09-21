from features.base import Feature
from features.designs.controller import Designs
from features.designs.details import DesignsDetails

__all__ = ["Designs"]


class DesignsFeature(Feature):
    details = DesignsDetails
