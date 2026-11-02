from core.base.upgrade.version_four_move import VersionFourMove


# @sin architecture_modules_MoveInUpgradeFolderDetector
# @sin architecture_layout_KindFoldersHoldTheirKindDetector
class StrayMove(VersionFourMove):
    name = "stray"
    reads = ["strays"]
