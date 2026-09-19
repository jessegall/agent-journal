from features.base import Feature


class Hub(Feature):
    name = "hub"
    title_ = "Every journal on this machine, one bar each"
    abstract_ = "The hub page shows every journal running on this machine as one expandable status bar, live over each peer's own stream"
    help_ = "Always on: every viewer answers /api/summary and lets a sibling viewer on this machine read and act on it; the hub page is under the journal switcher."
    fixed = True
