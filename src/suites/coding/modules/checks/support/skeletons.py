from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

CHECKS_CHECKS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32),
        SkeletonPart.grid([
            SkeletonPart.card([
                SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "90px"), SkeletonPart.grow(), SkeletonPart.block(18, "54px")]),
                SkeletonPart.line(SkeletonSize.MEDIUM, "55%"),
                SkeletonPart.line(SkeletonSize.SMALL, "80%"),
                SkeletonPart.block(26, "60px"),
                SkeletonPart.line(SkeletonSize.SMALL, "45%"),
            ], spacing=8, padding="14px 16px", count=6),
        ], width="280px", spacing=12, padding="8px 8px"),
    ], spacing=8, padding="8px 12px"),
]
