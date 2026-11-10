from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

REMINDERS_REMINDERS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.block(28), SkeletonPart.block(28, "150px"), SkeletonPart.block(28, "130px"), SkeletonPart.block(28, "50px"), SkeletonPart.block(28, "50px")]),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "50%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "100px"), SkeletonPart.block(24, "60px")], padding="8px", count=6),
    ], spacing=8, padding="8px 12px"),
]
