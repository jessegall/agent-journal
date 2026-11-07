from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

MCP_INTEGRATIONS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "100px"), SkeletonPart.line(SkeletonSize.SMALL, "50px")], spacing=10),
        SkeletonPart.block(32),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "80px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "40px"), SkeletonPart.block(26, "70px")], spacing=10),
            SkeletonPart.line(SkeletonSize.SMALL, "40%"),
            SkeletonPart.line(SkeletonSize.SMALL, "50%"),
        ], spacing=6, padding="6px 8px"),
        SkeletonPart.line(SkeletonSize.SMALL, "90px"),
        SkeletonPart.row([SkeletonPart.block(28), SkeletonPart.block(28), SkeletonPart.block(28, "50px")], spacing=6),
        SkeletonPart.line(SkeletonSize.SMALL, "70px"),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "90px"), SkeletonPart.grow(), SkeletonPart.block(26, "52px")]),
            SkeletonPart.line(SkeletonSize.SMALL, "55%"),
        ], spacing=6, padding="6px 8px", count=6),
    ], spacing=10, padding="8px 12px"),
]
