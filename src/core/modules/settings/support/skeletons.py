from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

PROJECT_HOOKS_SKELETON = [SkeletonPart.stack([
    SkeletonPart.row([SkeletonPart.block(32, "100px"), SkeletonPart.block(32, "120px")]),
    SkeletonPart.line(SkeletonSize.MEDIUM, "360px"),
    SkeletonPart.block(72, count=3),
], spacing=12, padding="12px")]

SETTINGS_SETTINGS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(30),
        SkeletonPart.row([SkeletonPart.block(34, "340px"), SkeletonPart.block(30, "180px"), SkeletonPart.line(SkeletonSize.SMALL, "170px")], spacing=12),
        SkeletonPart.row([
            SkeletonPart.stack([SkeletonPart.block(30, "150px", count=10)], spacing=4),
            SkeletonPart.stack([
                SkeletonPart.line(SkeletonSize.SMALL, "80px"),
                SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "260px"), SkeletonPart.line(SkeletonSize.SMALL, "480px"), SkeletonPart.block(32, "190px")], spacing=6, count=4),
            ], spacing=14, padding="8px 0 0 20px"),
        ], spacing=28),
    ], spacing=12, padding="8px 12px"),
]
