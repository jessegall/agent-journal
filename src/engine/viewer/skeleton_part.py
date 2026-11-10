from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.viewer.skeleton_shape import SkeletonShape
from engine.viewer.skeleton_size import SkeletonSize


@dataclass(frozen=True)
class SkeletonPart:
    """One part of the skeleton a window declares of itself: a shape, drawn as many times as its count says, with
    the size, width and height a leaf takes, and the spacing, padding and parts a group holds."""

    shape: SkeletonShape
    size: SkeletonSize = SkeletonSize.MEDIUM
    width: str = ""
    height: int = 0
    count: int = 1
    spacing: int = 0
    padding: str = ""
    parts: Sequence["SkeletonPart"] = ()

    @classmethod
    def line(cls, size: SkeletonSize = SkeletonSize.MEDIUM, width: str = "100%", count: int = 1) -> "SkeletonPart":
        return cls(SkeletonShape.LINE, size=size, width=width, count=count)

    @classmethod
    def circle(cls, size: SkeletonSize = SkeletonSize.MEDIUM) -> "SkeletonPart":
        return cls(SkeletonShape.CIRCLE, size=size)

    @classmethod
    def block(cls, height: int, width: str = "100%", count: int = 1) -> "SkeletonPart":
        return cls(SkeletonShape.BLOCK, height=height, width=width, count=count)

    @classmethod
    def grow(cls) -> "SkeletonPart":
        return cls(SkeletonShape.GROW)

    @classmethod
    def row(cls, parts: Sequence["SkeletonPart"], spacing: int = 8, padding: str = "", count: int = 1) -> "SkeletonPart":
        return cls(SkeletonShape.ROW, parts=parts, spacing=spacing, padding=padding, count=count)

    @classmethod
    def stack(cls, parts: Sequence["SkeletonPart"], spacing: int = 8, padding: str = "", count: int = 1) -> "SkeletonPart":
        return cls(SkeletonShape.STACK, parts=parts, spacing=spacing, padding=padding, count=count)

    @classmethod
    def card(cls, parts: Sequence["SkeletonPart"], spacing: int = 8, padding: str = "12px 14px", count: int = 1) -> "SkeletonPart":
        return cls(SkeletonShape.CARD, parts=parts, spacing=spacing, padding=padding, count=count)

    @classmethod
    def grid(cls, parts: Sequence["SkeletonPart"], width: str = "320px", spacing: int = 12, padding: str = "", count: int = 1) -> "SkeletonPart":
        return cls(SkeletonShape.GRID, parts=parts, width=width, spacing=spacing, padding=padding, count=count)

    def listed(self) -> Mapping[str, object]:
        return {"shape": self.shape.value, "size": self.size.value, "width": self.width, "height": self.height, "count": self.count,
                "spacing": self.spacing, "padding": self.padding, "parts": [part.listed() for part in self.parts]}
