from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.skeleton_size import SkeletonSize

CODING_GIT_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.stack([
            SkeletonPart.line(SkeletonSize.MEDIUM, "90px"),
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "110px"), SkeletonPart.line(SkeletonSize.SMALL, "90px"), SkeletonPart.line(SkeletonSize.MEDIUM, "40%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "140px")], spacing=10, count=3),
        ], spacing=6),
        SkeletonPart.stack([
            SkeletonPart.line(SkeletonSize.MEDIUM, "120px"),
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "56px"), SkeletonPart.line(SkeletonSize.MEDIUM, "55%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "140px")], spacing=10, count=5),
        ], spacing=6),
        SkeletonPart.stack([
            SkeletonPart.line(SkeletonSize.MEDIUM, "130px"),
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "40px"), SkeletonPart.line(SkeletonSize.MEDIUM, "50%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "100px")], spacing=10, count=3),
        ], spacing=6),
    ], spacing=24, padding="24px 28px"),
]

CODING_FILES_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(32, "280px"), SkeletonPart.block(26, "60px")], spacing=10, padding="8px 12px"),
    SkeletonPart.row([
        SkeletonPart.stack([
            SkeletonPart.row([SkeletonPart.block(13, "13px"), SkeletonPart.line(SkeletonSize.MEDIUM, "130px")], spacing=8, padding="4px 8px", count=12),
        ], spacing=2, padding="6px", ),
        SkeletonPart.grow(),
    ], spacing=0),
]

CODING_WORK_MODE_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(24, "70px"), SkeletonPart.block(24, "200px"), SkeletonPart.block(24, "24px")], spacing=10, padding="8px 12px"),
]

CODING_AGENT_SETTINGS_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(24, "120px")], padding="8px 12px"),
    SkeletonPart.row([SkeletonPart.block(24, "100%")], padding="4px 12px"),
    SkeletonPart.row([SkeletonPart.block(24, "100%")], padding="4px 12px"),
]

CODING_FILE_FEED_SKELETON = [
    SkeletonPart.row([SkeletonPart.block(32)], padding="8px 12px"),
    SkeletonPart.grid([
        SkeletonPart.card([
            SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "50%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "60px")]),
            SkeletonPart.line(SkeletonSize.SMALL, "90%", count=5),
        ], spacing=8, count=6),
    ], width="320px", spacing=10, padding="12px"),
]

CODING_FILE_EDITS_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.block(30, "320px"),
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.MEDIUM, "60%"), SkeletonPart.grow(), SkeletonPart.line(SkeletonSize.SMALL, "30px"), SkeletonPart.line(SkeletonSize.SMALL, "30px"), SkeletonPart.line(SkeletonSize.SMALL, "60px")],
                         spacing=10, padding="6px 8px", count=10),
    ], spacing=8, padding="8px 12px"),
]

CODING_TERMINAL_SKELETON = [
    SkeletonPart.stack([
        SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "10px"), SkeletonPart.line(SkeletonSize.SMALL, "60%")], spacing=7, count=14),
    ], spacing=6, padding="8px 12px"),
    SkeletonPart.row([SkeletonPart.line(SkeletonSize.SMALL, "8px"), SkeletonPart.line(SkeletonSize.SMALL, "40%")], spacing=8, padding="6px 12px"),
]
