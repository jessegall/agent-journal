from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

TRANSCRIPTIONS_TRANSCRIPTIONS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.block(26, "120px"), SkeletonPart.block(26, "220px")]),
        SkeletonPart.block(32),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "30%"), SkeletonPart.line(SkeletonSize.SMALL, "20%"), SkeletonPart.line(SkeletonSize.SMALL, "35%")], spacing=10, padding="6px 8px", count=8),
    ], spacing=8, padding="8px 12px"),
]
