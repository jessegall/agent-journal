from dataclasses import dataclass


@dataclass(frozen=True)
class ForeignRun:
    # @righteous naming_sentence_variable_name
    timed_out: bool
    # @sin naming_sentence_variable_name
    from_cache: bool
