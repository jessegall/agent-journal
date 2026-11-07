from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

DUMPS_DUMPS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32),
        SkeletonPart.card([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "30%"), SkeletonPart.grow(), SkeletonPart.block(18, "60px")], spacing=10),
            SkeletonPart.line(SkeletonSize.SMALL, "70%"),
            SkeletonPart.row([SkeletonPart.block(4), SkeletonPart.line(SkeletonSize.SMALL, "120px")], spacing=10),
            SkeletonPart.line(SkeletonSize.SMALL, "90%", count=4),
        ], spacing=8, padding="14px 16px"),
        SkeletonPart.card([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "30%"), SkeletonPart.grow(), SkeletonPart.block(18, "60px")]),
        ], padding="14px 16px", count=3),
    ], spacing=12, padding="8px 12px"),
]
