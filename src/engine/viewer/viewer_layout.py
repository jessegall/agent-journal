from typing import ClassVar

from engine.viewer.layout_shape import LayoutShape


class ViewerLayout:
    """The default layout of one viewer page a suite names: its shape."""

    shape: ClassVar[LayoutShape]
