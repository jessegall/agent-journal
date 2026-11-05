from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

AGENTS_AGENTS_SKELETON = [
SkeletonPart.row([SkeletonPart.block(32), SkeletonPart.block(30, "170px"), SkeletonPart.block(26, "96px")], spacing=10, padding="8px 12px"),
SkeletonPart.stack([
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "25%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "6%")]),
    SkeletonPart.line(SkeletonSize.SMALL, "35%"),
    SkeletonPart.line(SkeletonSize.SMALL, "28%"),
], spacing=6, padding="10px 12px", count=4),
]

AGENTS_HELPERS_SKELETON = [
SkeletonPart.row([SkeletonPart.block(32), SkeletonPart.block(30, "170px"), SkeletonPart.block(26, "96px")], spacing=10, padding="8px 12px"),
SkeletonPart.stack([
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "25%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "6%")]),
    SkeletonPart.line(SkeletonSize.SMALL, "35%"),
    SkeletonPart.line(SkeletonSize.SMALL, "28%"),
], spacing=6, padding="10px 12px", count=4),
]

AGENTS_TRANSCRIPT_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "72px"), SkeletonPart.line(SkeletonSize.SMALL, "40px"), SkeletonPart.line(SkeletonSize.MEDIUM, "70%")],
                         padding="6px 8px", spacing=10, count=8),
    ], spacing=2, padding="8px 12px"),
]
