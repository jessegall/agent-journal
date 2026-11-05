from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

DRIVERS_NUDGES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "120px"), SkeletonPart.line(SkeletonSize.SMALL, "60px"), SkeletonPart.line(SkeletonSize.SMALL, "90px")], spacing=10),
            SkeletonPart.line(SkeletonSize.SMALL, "85%"),
        ], spacing=4, padding="6px 8px", count=10),
    ], spacing=2, padding="8px 12px"),
]

DRIVERS_HOOK_CALLS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.line(SkeletonSize.MEDIUM, "55%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "15%")],
                         spacing=10, padding="6px 8px", count=12),
    ], spacing=2, padding="8px 12px"),
]
