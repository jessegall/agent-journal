from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

PROCESSES_OUTPUTS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(32),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "64px"), SkeletonPart.line(SkeletonSize.MEDIUM, "50%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "30px"), SkeletonPart.line(SkeletonSize.SMALL, "40px")],
                         spacing=8, padding="6px 8px", count=10),
    ], spacing=6, padding="8px 12px"),
]

PROCESSES_OUTPUT_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "55%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "90px")], padding="0 0 6px"),
        SkeletonPart.line(SkeletonSize.SMALL, "90%", count=6),
        SkeletonPart.line(SkeletonSize.SMALL, "60%", count=4),
        SkeletonPart.line(SkeletonSize.SMALL, "80%", count=6),
    ], spacing=8, padding="8px 12px"),
]
