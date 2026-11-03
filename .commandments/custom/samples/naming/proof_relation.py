from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Proof(Model):
    # @righteous naming_SentenceVariableNameDetector
    proved_on: int | None = None
    # @righteous naming_SentenceVariableNameDetector
    tested_on: int | None = None


# @sin naming_SentenceVariableNameDetector
blocked_outside = True
# @sin naming_SentenceVariableNameDetector
proved_on = 1
