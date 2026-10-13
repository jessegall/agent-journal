from pathlib import Path

from engine import runtime
from engine.record import Record


def booted(root: Path) -> Record:
    """The record a process a feature starts for itself works over, once the features are loaded as the server loads them."""
    from framework.loaded import load_features
    from framework.switches import watch_change_log
    load_features(root)
    watch_change_log()
    return Record(root, runtime.env(root))
