from features.base import Feature


class Identity(Feature):
    name = "identity"
    title_ = "Project identity"
    abstract_ = "A project-colored band distinguishes this journal from every other one"
    help_ = "Always on: the project name chooses a stable color, which Settings can override for this project."
    fixed = True
