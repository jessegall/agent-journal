from features.base import FeatureDetails


class RowLinksDetails(FeatureDetails):
    name = "row_links"

    title = "Row links"

    abstract = "A row named in text, like to-do 648 or message 1712, becomes a link to it in the viewer"

    help = """
        Wherever the viewer shows text, a type followed by a number is marked on the server as a
        link to that row, and the viewer draws it as a chip that opens it. Text in code is left
        alone, and what is saved is always the plain words.
    """
