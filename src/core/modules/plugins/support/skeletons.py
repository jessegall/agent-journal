from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

PLUGINS_PLUGINS_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(34, "640px")], padding="8px 14px 8px 22px"),
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "60%", count=2),
        SkeletonPart.grid([
            SkeletonPart.card([
                SkeletonPart.row([
                    SkeletonPart.block(40, "40px"),
                    SkeletonPart.stack([SkeletonPart.line(SkeletonSize.LARGE, "120px"), SkeletonPart.line(SkeletonSize.SMALL, "40px")], spacing=4),
                    SkeletonPart.grow(),
                    SkeletonPart.block(20, "36px"),
                ], spacing=12),
                SkeletonPart.line(SkeletonSize.MEDIUM, "100%", count=2),
                SkeletonPart.line(SkeletonSize.SMALL, "60%"),
                SkeletonPart.row([SkeletonPart.block(26, "70px"), SkeletonPart.block(26, "50px"), SkeletonPart.grow(), SkeletonPart.block(26, "26px")], spacing=6),
            ], spacing=12, padding="18px 18px 14px", count=4),
        ], width="340px", spacing=16),
    ], spacing=16, padding="16px 22px"),
]
