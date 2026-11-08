from enum import StrEnum


class HelperRole(StrEnum):
    """The kinds of helper core registers, each a helper type. The read-only kind keeps the key "helper": it is what
    stored agent rows, their events and plugin manifests say of it, so no plugin breaks."""

    HELPER = "helper"
    REVIEWER = "reviewer"
