from dataclasses import dataclass


@dataclass(frozen=True)
class ForeignRun:
    # @righteous naming_SentenceVariableNameDetector
    timed_out: bool
    # @sin naming_SentenceVariableNameDetector
    from_cache: bool
