from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

LIBRARY_TEAMS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.LARGE, "140px"),
        SkeletonPart.line(SkeletonSize.SMALL, "60%"),
        SkeletonPart.line(SkeletonSize.MEDIUM, "100%", count=4),
    ], spacing=10, padding="18px 20px"),
]
