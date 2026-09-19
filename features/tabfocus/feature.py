from features.base import Feature


class TabFocus(Feature):
    name = "tabfocus"
    title_ = "One viewer tab"
    abstract_ = "A journal launch focuses its existing viewer tab instead of opening another"
    help_ = "Always on: macOS focuses a matching tab in a running browser; other systems and missing tabs use the normal browser opener."
    fixed = True
