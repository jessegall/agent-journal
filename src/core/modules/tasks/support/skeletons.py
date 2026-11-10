from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

TASKS_TASKS_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(32), SkeletonPart.block(26, "96px")], spacing=10, padding="8px 12px"),
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "110px"),
        SkeletonPart.row([SkeletonPart.circle(SkeletonSize.SMALL), SkeletonPart.line(SkeletonSize.SMALL, "16px"), SkeletonPart.line(SkeletonSize.MEDIUM, "45%"), SkeletonPart.grow(), SkeletonPart.circle(SkeletonSize.SMALL)], spacing=10, count=3),
    ], spacing=10, padding="8px 12px", count=4),
]
