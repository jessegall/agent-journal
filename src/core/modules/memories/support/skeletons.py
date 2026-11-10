from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

MEMORIES_MEMORIES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(30, "100px"),
        SkeletonPart.block(26, "92px"),
        SkeletonPart.block(32),
        SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.line(SkeletonSize.SMALL, "22%")], spacing=4, padding="10px 8px", count=6),
    ], spacing=8, padding="8px 12px"),
]
