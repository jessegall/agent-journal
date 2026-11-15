from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class HelperGrantedNudge(NudgeDeclaration):
    """The nudge helpers.granted."""

    key = "helpers.granted"
    type = NudgeType.STEERING
    text = "helper-grant:{grant} lists what you may run with your helper run command"
    turn_limited = False
    wakes_agent = True
    id_field = "grant"
    plural_text = "helper-grants {grant} say what you may run"
