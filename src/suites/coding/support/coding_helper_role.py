from enum import StrEnum


class CodingHelperRole(StrEnum):
    """The kinds of helper the coding suite's drivers and rules name. Like every helper type's key, each kind is what
    stored agent rows, their events and plugin manifests say; the read-only kind keeps the key "helper"."""

    HELPER = "helper"
    WORKER = "worker"
    REVIEWER = "reviewer"
    VERIFIER = "verifier"
