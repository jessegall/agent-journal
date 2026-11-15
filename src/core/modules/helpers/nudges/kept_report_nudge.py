from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class KeptReportNudge(NudgeDeclaration):
    """The nudge helpers.kept-report, told to the parent of a helper whose report could not be saved twice."""

    key = "helpers.kept-report"
    type = NudgeType.NOTICE
    text = "helper {agent}'s report on job {job} could not be saved; its text is kept on the job: journal helper-job show {job}, then journal helper report-retry {agent} or report-drop {agent}"
