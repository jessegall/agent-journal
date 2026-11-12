from engine.enums.skeleton_size import SkeletonSize
from engine.viewer.skeleton_part import SkeletonPart

CHAT_ERRORS_SKELETON = [
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "70px"), SkeletonPart.line(SkeletonSize.SMALL, "30%"), SkeletonPart.grow(), SkeletonPart.block(24, "70px")], padding="10px 16px"),
]
