from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

PHONE_PHONES_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32, "110px"),
        SkeletonPart.line(SkeletonSize.SMALL, "50%", count=4),
        SkeletonPart.block(32),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "30%"), SkeletonPart.grow(), SkeletonPart.block(24, "60px")], padding="6px 8px", count=3),
    ], spacing=14, padding="8px 12px"),
]
