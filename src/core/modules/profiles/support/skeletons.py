from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

PROFILES_PROFILES_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(32, "280px"), SkeletonPart.block(26, "100px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "150px")], spacing=12, padding="8px 14px 8px 22px"),
    SkeletonPart.row([
        SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "150px"), SkeletonPart.line(SkeletonSize.SMALL, "380px")], spacing=4),
        SkeletonPart.grow(),
        SkeletonPart.stack([SkeletonPart.line(SkeletonSize.SMALL, "190px"), SkeletonPart.line(SkeletonSize.SMALL, "110px")], spacing=4),
    ], spacing=10, padding="10px 14px 10px 22px", count=8),
]
