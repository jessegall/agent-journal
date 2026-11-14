from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

USAGE_USAGE_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.stack([SkeletonPart.line(SkeletonSize.LARGE, "110px")], padding="2px 0 6px"),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.LARGE, "30%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.LARGE, "30px")]),
            SkeletonPart.block(4),
            SkeletonPart.block(13, "45%"),
        ], spacing=4, padding="6px 0", count=2),
        SkeletonPart.stack([
            SkeletonPart.line(SkeletonSize.LARGE, "70%"),
            SkeletonPart.row([SkeletonPart.block(24, "30%"), SkeletonPart.block(24, "30%"), SkeletonPart.block(24, "15%"), SkeletonPart.block(24, "20%")], spacing=6),
        ], spacing=6, padding="8px 0"),
    ], padding="14px 16px"),
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
        SkeletonPart.stack([SkeletonPart.line(SkeletonSize.LARGE, "110px")], padding="2px 0 6px"),
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.LARGE, "40px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.LARGE, "30px")]),
            SkeletonPart.block(4),
            SkeletonPart.block(13, "60%"),
        ], spacing=4, padding="6px 0"),
    ], padding="14px 16px"),
]
