from features.base import Feature


class Extension(Feature):
    name = "extension"
    title_ = "The chat that follows you home"
    abstract_ = "The Chrome shell carries the journal chat across tabs and points at the page beneath it"
    help_ = "Always available from Settings as a zip, with its window, picker and browser-driving bridge kept in the package."
    fixed = True
