from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

SEARCH_SEARCH_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.block(34, "520px"), SkeletonPart.block(28, "70px")], spacing=10),
        SkeletonPart.row([SkeletonPart.block(22, "70px", count=5)], spacing=6),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "110px"), SkeletonPart.line(SkeletonSize.MEDIUM, "60%")], spacing=12, padding="8px 10px", count=8),
    ], spacing=14, padding="8px 12px"),
]
