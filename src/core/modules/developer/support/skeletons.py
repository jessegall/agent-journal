from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

DEVELOPER_NUMBERS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.block(26, "100px"), SkeletonPart.block(26, "140px")]),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "30%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "50px", count=4)], padding="4px 8px", spacing=24),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "35%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "50px", count=4)], padding="4px 8px", spacing=24, count=8),
    ], spacing=6, padding="8px 12px"),
]

DEVELOPER_HOOK_REQUESTS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "60px"), SkeletonPart.line(SkeletonSize.SMALL, "30%"), SkeletonPart.line(SkeletonSize.SMALL, "25%")],
                         padding="6px 8px", count=10),
    ], spacing=2, padding="8px 12px"),
]
