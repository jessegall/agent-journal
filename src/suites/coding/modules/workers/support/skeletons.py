from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

WORKERS_POINTS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([
            SkeletonPart.line(SkeletonSize.SMALL, "16px"),
            SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "420px"), SkeletonPart.line(SkeletonSize.SMALL, "280px")], spacing=2),
        ], spacing=10, padding="6px 8px", count=6),
    ], spacing=2, padding="8px 12px"),
]

WORKERS_TODOS_SKELETON = [
    SkeletonPart.stack([SkeletonPart.row(
[SkeletonPart.line(SkeletonSize.MEDIUM, "50%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "70px")],
padding="6px 8px", count=10)], spacing=2, padding="8px 12px"),
]

WORKERS_WORKERS_SKELETON = [
SkeletonPart.stack([
    SkeletonPart.line(SkeletonSize.SMALL, "80px"),
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "50px")],
                     padding="5px 6px", spacing=10, count=5),
], spacing=4, padding="14px 16px"),
]

WORKERS_MODELS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "95%", count=2),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "110px"), SkeletonPart.block(14, "14px"), SkeletonPart.line(SkeletonSize.MEDIUM, "100px")], spacing=14, padding="12px 8px", count=6),
    ], spacing=6, padding="8px 12px"),
]

WORKERS_WORKTREES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([
            SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "120px"), SkeletonPart.line(SkeletonSize.SMALL, "300px")], spacing=2),
            SkeletonPart.grow(),
            SkeletonPart.block(26, "70px"),
        ], spacing=8, padding="8px", count=5),
    ], spacing=2, padding="8px 12px"),
]
