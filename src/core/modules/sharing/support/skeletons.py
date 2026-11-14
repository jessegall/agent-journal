from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

SHARING_SHARES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(28),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.block(28, "230px")], spacing=12),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "60px"), SkeletonPart.block(24, "170px")], spacing=12),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "130px"), SkeletonPart.block(16, "28px")], spacing=12),
        SkeletonPart.block(26, "90px"),
        SkeletonPart.block(32),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "60%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "70px")], padding="10px 8px", count=4),
    ], spacing=10, padding="8px 12px"),
]
