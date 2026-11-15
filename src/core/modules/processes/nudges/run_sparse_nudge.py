from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RunSparseNudge(NudgeDeclaration):
    """The nudge processes.run_sparse."""

    key = "processes.run_sparse"
    type = NudgeType.NOTICE
    text = "Output {output} prints about once every {seconds}s, too sparse for a reader: {hint}"
    plural_text = "outputs {output} print too seldom for a reader to follow: {hint}"
    id_field = "output"
