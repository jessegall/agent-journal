from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

DOCUMENTS_DOCUMENTS_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(32), SkeletonPart.block(30, "130px"), SkeletonPart.block(30, "110px"), SkeletonPart.block(30, "120px"), SkeletonPart.block(26, "100px")],
                     spacing=10, padding="8px 12px"),
    SkeletonPart.row([
        SkeletonPart.stack([
            SkeletonPart.line(SkeletonSize.MEDIUM, "50px"),
            SkeletonPart.row([
                SkeletonPart.block(34, "28px"),
                SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "110px"), SkeletonPart.line(SkeletonSize.SMALL, "200px"), SkeletonPart.line(SkeletonSize.SMALL, "80px")], spacing=6),
            ], spacing=12, padding="10px 12px", count=5),
        ], spacing=8, padding="6px 10px"),
        SkeletonPart.grow(),
    ], spacing=0),
]
