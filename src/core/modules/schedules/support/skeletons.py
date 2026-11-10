from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

SCHEDULES_JOBS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([
            SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "300px"), SkeletonPart.line(SkeletonSize.SMALL, "200px")], spacing=2),
            SkeletonPart.grow(),
            SkeletonPart.block(26, "60px"),
        ], spacing=10, padding="6px 0", count=6),
    ], spacing=6, padding="14px 16px"),
]
