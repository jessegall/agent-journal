from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

USAGE_USAGE_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "110px"),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "30%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "30px")]),
            SkeletonPart.block(4),
            SkeletonPart.line(SkeletonSize.SMALL, "25%"),
        ], spacing=4, padding="6px 0", count=2),
    ], spacing=6, padding="14px 16px"),
]

USAGE_COST_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "130px"),
        SkeletonPart.line(SkeletonSize.SMALL, "95%", count=2),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "50px")], count=2),
        SkeletonPart.line(SkeletonSize.SMALL, "60px"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "35%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "50px")], count=3),
        SkeletonPart.line(SkeletonSize.SMALL, "60px"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "35%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "50px")], count=2),
    ], spacing=6, padding="14px 16px"),
]

USAGE_FITNESS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.MEDIUM, "30%"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "45%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "60px")], count=6),
        SkeletonPart.line(SkeletonSize.SMALL, "90%"),
    ], spacing=6, padding="14px 16px"),
]

USAGE_MACHINE_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.MEDIUM, "25%"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "55%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "40px")], count=3),
        SkeletonPart.line(SkeletonSize.SMALL, "90%"),
    ], spacing=6, padding="14px 16px"),
]

USAGE_CONTEXT_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.SMALL, "110px"),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.MEDIUM, "30px")]),
            SkeletonPart.block(4),
            SkeletonPart.line(SkeletonSize.SMALL, "30%"),
        ], spacing=4, padding="6px 0"),
    ], spacing=6, padding="14px 16px"),
]
