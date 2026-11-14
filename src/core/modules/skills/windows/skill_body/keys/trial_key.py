from engine.viewer.window_key import WindowKey
from engine.enums.key_loading import KeyLoading


class TrialKey(WindowKey):
    """The trial data of the skills.skill-body window."""

    name = "trial"
    read = "trigger try"
    arguments = ["phrases", "sentence", "match-mode"]
    loading = KeyLoading.REQUESTED
