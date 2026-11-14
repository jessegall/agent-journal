from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

TRIGGERS_TRIGGERS_SKELETON = [
SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "90px"), SkeletonPart.grow(), SkeletonPart.block(26, "110px")], padding="8px 20px"),
SkeletonPart.grid([
    SkeletonPart.card([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "110px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "40px")]),
        SkeletonPart.line(SkeletonSize.MEDIUM, "60%"),
        SkeletonPart.line(SkeletonSize.SMALL, "45%"),
    ], spacing=16, padding="14px 16px", count=8),
], width="280px", spacing=12, padding="16px 20px"),
]
