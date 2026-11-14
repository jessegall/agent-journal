from engine.viewer.skeleton_part import SkeletonPart
from engine.enums.skeleton_size import SkeletonSize

PROJECT_RULES_RULES_SKELETON = [
    SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "60%"), SkeletonPart.line(SkeletonSize.MEDIUM, "45%")], spacing=8, padding="8px 12px"),
]
