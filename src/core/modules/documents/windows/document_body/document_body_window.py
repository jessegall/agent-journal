from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.skeleton_part import SkeletonPart


class DocumentBodyWindow(Window):
    """The Text window."""

    name = "documents.document-body"
    title = "Text"
    entry = "document-body.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.SECTION
    icon = WindowIcon.DOCUMENT
    skeleton = [SkeletonPart.line()]
    reads = ["doc inspect", "report inspect", "doc comments", "report comments", "doc revisions", "doc revision", "question list", "link list", "agent people"]
    runs = ["doc comment", "report comment", "doc close", "doc settle", "report close", "doc edit", "report edit"]
    events = ["doc.*", "report.*", "question.*"]
