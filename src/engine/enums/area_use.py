from enum import Enum


class AreaUse(Enum):
    """Who may import an engine area: contract areas are for modules, internal areas for the engine alone."""

    CONTRACT = "contract"
    INTERNAL = "internal"
