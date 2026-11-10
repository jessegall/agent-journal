from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

REVIEWS_REVIEWER_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32),
        SkeletonPart.stack([
            SkeletonPart.line(SkeletonSize.MEDIUM, "30%"),
            SkeletonPart.row([SkeletonPart.block(8, "8px"), SkeletonPart.line(SkeletonSize.MEDIUM, "70%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "40px")], count=3),
        ], spacing=8, padding="12px 14px", count=3),
    ], spacing=8, padding="8px 12px"),
]

REVIEWS_REVIEWERS_SKELETON = [
SkeletonPart.stack([
    SkeletonPart.line(SkeletonSize.SMALL, "80px"),
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "50px")],
                     padding="5px 6px", spacing=10, count=5),
], spacing=4, padding="14px 16px"),
]
