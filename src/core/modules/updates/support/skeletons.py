from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

UPDATES_UPDATES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.block(26, "90px")]),
        SkeletonPart.line(SkeletonSize.SMALL, "110px"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "80px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "130px")], count=2),
        SkeletonPart.line(SkeletonSize.SMALL, "100px"),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "60px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "70px")]),
            SkeletonPart.line(SkeletonSize.SMALL, "100%", count=2),
        ], spacing=6, count=4),
    ], spacing=10, padding="8px 12px"),
]
