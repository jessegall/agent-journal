from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

PLANS_PLANS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "60px", count=2)], spacing=16),
        SkeletonPart.grid([
            SkeletonPart.card([
                SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.grow(), SkeletonPart.block(18, "54px")]),
                SkeletonPart.line(SkeletonSize.MEDIUM, "50%"),
                SkeletonPart.block(4),
                SkeletonPart.line(SkeletonSize.SMALL, "40%"),
            ], spacing=10, padding="14px 16px", count=10),
        ], width="280px", spacing=12),
    ], spacing=14, padding="8px 12px"),
]
