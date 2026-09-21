from features.base import Feature
from features.templates.controller import Templates
from features.templates.details import TemplatesDetails

__all__ = ["Templates"]


class TemplatesFeature(Feature):
    details = TemplatesDetails
