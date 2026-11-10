from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

SECRETS_SECRETS_SKELETON = [
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.grow(), SkeletonPart.block(28, "110px")], padding="8px 14px 8px 22px"),
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "60%", count=2),
        SkeletonPart.line(SkeletonSize.MEDIUM, "110px"),
        SkeletonPart.grid([
            SkeletonPart.card([
                SkeletonPart.row([
                    SkeletonPart.block(40, "40px"),
                    SkeletonPart.stack([SkeletonPart.line(SkeletonSize.LARGE, "130px"), SkeletonPart.line(SkeletonSize.SMALL, "50px")], spacing=4),
                ], spacing=12),
                SkeletonPart.line(SkeletonSize.MEDIUM, "90%"),
                SkeletonPart.line(SkeletonSize.SMALL, "55%", count=2),
                SkeletonPart.row([SkeletonPart.block(24, "62px"), SkeletonPart.grow(), SkeletonPart.block(24, "24px")]),
            ], spacing=10, padding="18px 18px 14px", count=4),
        ], width="340px", spacing=16),
    ], spacing=16, padding="22px 24px"),
]
