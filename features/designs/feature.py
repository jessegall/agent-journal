from typing import ClassVar

from controllers.base import Controller
from features.base import Feature
from features.designs.controller import Designs
from features.designs.details import DesignsDetails


class DesignsFeature(Feature):
    details = DesignsDetails
    controller: ClassVar[type[Controller]] = Designs
