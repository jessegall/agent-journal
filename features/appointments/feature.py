from features.base import Feature


class Appointments(Feature):
    name = "appointments"
    title_ = "Appoint an online agent"
    abstract_ = "An unclaimed environment can take an online agent from the viewer"
    help_ = "Always on: the chat bar lists live sessions when its environment has no agent and moves the chosen session here."
    fixed = True
