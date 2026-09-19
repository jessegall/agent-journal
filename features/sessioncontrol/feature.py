from features.base import Feature


class SessionControl(Feature):
    name = "sessioncontrol"
    title_ = "Change a live session's model"
    abstract_ = "The agent bar sends supported model and effort commands to its live CLI"
    help_ = "Always on: Claude accepts model and effort choices directly; Codex opens its native model and effort picker."
    fixed = True
