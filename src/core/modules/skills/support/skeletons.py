from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

SKILLS_SKILLS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "60%"),
        SkeletonPart.block(24, "100%", count=3),
        SkeletonPart.block(26),
    ], spacing=10, padding="8px 12px"),
]
