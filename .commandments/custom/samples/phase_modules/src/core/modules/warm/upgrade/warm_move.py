from engine.upgrade.version_four_move import VersionFourMove


# @righteous architecture_modules_move_outside_upgrade_folder
class WarmMove(VersionFourMove):
    name = "warm"
    reads = ["warms"]
