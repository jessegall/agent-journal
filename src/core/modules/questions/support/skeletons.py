from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

QUESTIONS_QUESTIONS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32),
        SkeletonPart.card([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "40px")]),
            SkeletonPart.line(SkeletonSize.LARGE, "45%"),
            SkeletonPart.block(56),
            SkeletonPart.block(38),
            SkeletonPart.block(36),
        ], spacing=8, padding="14px 16px", count=3),
    ], spacing=12, padding="8px 12px"),
]

QUESTIONS_QUESTION_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "70px"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "40px")]),
        SkeletonPart.line(SkeletonSize.LARGE, "45%"),
        SkeletonPart.block(56),
        SkeletonPart.block(38),
        SkeletonPart.block(36),
    ], spacing=8, padding="14px 16px"),
]

QUESTIONS_WAITING_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.line(SkeletonSize.MEDIUM, "220px"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "60px"), SkeletonPart.line(SkeletonSize.SMALL, "80px"), SkeletonPart.line(SkeletonSize.SMALL, "60px")],
                         spacing=10, padding="6px 8px", count=6),
    ], spacing=6, padding="8px 12px"),
]
