from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class ResultsKey(WindowKey):
    """The results data of the search.search window."""

    name = "results"
    read = "search find {terms} --split-terms"
    arguments = ["model"]
    loading = KeyLoading.REQUESTED
