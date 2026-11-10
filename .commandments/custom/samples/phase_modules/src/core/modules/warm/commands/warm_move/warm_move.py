from engine.upgrade.version_four_move import VersionFourMove


# @sin architecture_modules_move_outside_upgrade_folder
# @sin architecture_layout_helper_in_a_kind_folder
class StrayMove(VersionFourMove):
    name = "stray"
    reads = ["strays"]
