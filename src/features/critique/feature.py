from features.base import Feature
from features.critique.controller import Critiques
from features.critique.details import CritiqueDetails

__all__ = ["Critiques"]


class CritiqueFeature(Feature):
    details = CritiqueDetails
