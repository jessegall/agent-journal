from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class LinksKey(WindowKey):
    """The links.* data of the transcriptions.transcriptions window."""

    name = "links.*"
    read = "link list --row transcription:{id} --group-counterparts"
    arguments = ["page", "page-size", "kind"]
    loading = KeyLoading.REQUESTED
