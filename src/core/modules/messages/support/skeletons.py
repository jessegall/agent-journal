from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

MESSAGES_ATTACHMENTS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.block(32), SkeletonPart.block(30, "200px")], spacing=10),
        SkeletonPart.row([SkeletonPart.block(90, "120px", count=5)], spacing=8),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "80px"), SkeletonPart.line(SkeletonSize.SMALL, "40px")], spacing=10, count=5),
    ], spacing=10, padding="8px 14px 8px 22px"),
]

MESSAGES_CHAT_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.grow(), SkeletonPart.block(44, "60%")]),
        SkeletonPart.block(64, "70%"),
        SkeletonPart.row([SkeletonPart.grow(), SkeletonPart.block(36, "45%")]),
        SkeletonPart.block(88, "75%"),
        SkeletonPart.row([SkeletonPart.grow(), SkeletonPart.block(44, "55%")]),
        SkeletonPart.block(64, "65%"),
    ], spacing=10, padding="8px 12px"),
    SkeletonPart.grow(),
    SkeletonPart.stack([SkeletonPart.line(SkeletonSize.SMALL, "30%"), SkeletonPart.block(108)], spacing=10, padding="0 12px 8px"),
]
