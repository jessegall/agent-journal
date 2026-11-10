from typing import ClassVar

from engine.enums.area_use import AreaUse


class EngineArea:
    """The marker of one engine area folder: one line saying what the area is for, and who may import it."""

    summary: ClassVar[str]
    use: ClassVar[AreaUse]
