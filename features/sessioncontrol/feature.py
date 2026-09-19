from features.base import Feature


class SessionControl(Feature):
    name = "sessioncontrol"
    title_ = "Change a live session's model"
    abstract_ = "The agent bar sends supported model and effort commands to its live CLI"
    help_ = "Always on: the agent bar exposes each provider's supported model and effort choices."
    fixed = True
