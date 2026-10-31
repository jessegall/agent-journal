from core.base.upgrade.version_four_move import VersionFourMove


# @righteous architecture_modules_MoveInUpgradeFolderDetector
class WarmMove(VersionFourMove):
    name = "warm"
    reads = ["warms"]
