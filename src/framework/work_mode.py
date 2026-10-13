"""The work mode an environment is in, read from the feature's settings by whoever needs it beside the feature."""

from framework.loaded import FEATURES
from resources.extension import Extension
from resources.work_modes import MODES, NAME, kept_mode

CARRIED_IN = Extension()
"""The writers of the files that carry the mode's words, each taking the project folder and the record; a feature that writes such a file registers here, so the mode is picked without knowing who writes them."""


def mode_of(record) -> str:
    return kept_mode(FEATURES[NAME].values(record).mode)


def taking(record) -> str:
    """What the mode this environment is in says to do with the next ready row."""
    return MODES[mode_of(record)].taking
