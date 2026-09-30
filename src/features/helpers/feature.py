from features.base import Feature
from features.helpers.controller import Helpers
from features.helpers.details import HelpersDetails

__all__ = ["Helpers"]


class HelpersFeature(Feature):
    details = HelpersDetails
