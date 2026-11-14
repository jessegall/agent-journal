from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

SUGGESTIONS_SUGGESTIONS_SKELETON = [
    SkeletonPart.stack([SkeletonPart.block(32), SkeletonPart.row(
[SkeletonPart.line(SkeletonSize.MEDIUM, "50%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "70px")],
padding="6px 8px", count=10)], spacing=6, padding="8px 12px"),
]
