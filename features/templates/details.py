from features.base import FeatureDetails


class TemplatesDetails(FeatureDetails):
    name = "templates"

    title = "Templates"

    abstract = "Instructions and a starting skeleton that any resource can be made from"

    help = """
        A template is written once and used for many resources. Its brief holds the
        instructions the agent reads before working on anything made from it, and its parts are
        the skeleton a new resource starts with. applies_to says which types it is for; an empty
        list means any type.

        journal template create "<name>" --brief "<instructions>" --set applies_to=plan writes
        one, journal template section <n> "<part>" "<body>" adds to its skeleton.
    """
