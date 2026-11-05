from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.skeleton_size import SkeletonSize

TUNNEL_TUNNEL_SKELETON = [
    SkeletonPart.stack([SkeletonPart.line(SkeletonSize.MEDIUM, "120px"), SkeletonPart.line(SkeletonSize.SMALL, "60%")], spacing=6, padding="8px 12px"),
]
