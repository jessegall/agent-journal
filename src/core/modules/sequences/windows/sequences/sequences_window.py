from engine.viewer.window import Window
from core.modules.sequences.support.skeletons import SEQUENCES_SEQUENCES_SKELETON
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.sequences.windows.sequences.keys.board_key import BoardKey


class SequencesWindow(Window):
    """The Sequences window."""

    name = "sequences.sequences"
    title = "Sequences"
    entry = "sequences.js"
    loading = WindowLoading.COMPONENT
    skeleton = SEQUENCES_SEQUENCES_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.SEQUENCE
    reads = ["sequence list", "sequence show", "sequence-run list", "sequence board"]
    runs = ["sequence make", "sequence edit", "sequence delete"]
    events = ["sequence.*", "sequence_run.*"]
    keys = [BoardKey]
