from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Proof(Model):
    # @righteous naming_sentence_variable_name
    proved_on: int | None = None
    # @righteous naming_sentence_variable_name
    tested_on: int | None = None


# @sin naming_sentence_variable_name
blocked_outside = True
# @sin naming_sentence_variable_name
proved_on = 1
