from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

TEMPLATES_TEMPLATES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32),
        SkeletonPart.grid([
            SkeletonPart.card([
                SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "100px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "40px")]),
                SkeletonPart.line(SkeletonSize.MEDIUM, "55%"),
                SkeletonPart.line(SkeletonSize.SMALL, "90%"),
                SkeletonPart.line(SkeletonSize.SMALL, "40%"),
            ], spacing=10, padding="14px 16px", count=8),
        ], width="280px", spacing=12),
    ], spacing=12, padding="16px 20px"),
]
