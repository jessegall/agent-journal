from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

TUNLER_ACCOUNT_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.MEDIUM, "110px"),
        SkeletonPart.line(SkeletonSize.SMALL, "80%", count=2),
        SkeletonPart.row([SkeletonPart.block(26, "140px"), SkeletonPart.block(26, "80px")], spacing=8),
    ], spacing=8, padding="8px 12px"),
]
