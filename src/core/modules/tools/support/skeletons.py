from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

TOOLS_TOOLS_SKELETON = [SkeletonPart.stack([
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "90px"), SkeletonPart.grow(), SkeletonPart.block(26, "70px")]),
        SkeletonPart.line(SkeletonSize.SMALL, "70%"),
        SkeletonPart.row([SkeletonPart.block(28, "90px"), SkeletonPart.block(28, "110px")]),
    ], spacing=8, padding="12px"),
], spacing=12, padding="12px")]
