from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class PrivateCorpusNudge(NudgeDeclaration):
    """The nudge drivers.private_corpus."""

    key = "drivers.private_corpus"
    type = NudgeType.SAFETY_REFUSAL
    text = "The private command corpus is only read or run in its sandboxed go test: say in your report what you need"
