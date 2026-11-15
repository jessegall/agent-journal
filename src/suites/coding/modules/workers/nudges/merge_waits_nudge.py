from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergeWaitsNudge(NudgeDeclaration):
    """The nudge workers.merge_waits."""

    key = "workers.merge_waits"
    type = NudgeType.STEERING
    text = "The merge of worker {worker} waits for environment {environment} to check out {branch} again"
    turn_limited = False
    plural_text = 'The merges of workers {worker} wait for environment {environment} to check out {branch} again'
    id_field = "worker"
