from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

VIEWER_SHELL_SKELETON = [
    SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.line(SkeletonSize.SMALL, "70%")], padding="8px 12px"),
]
