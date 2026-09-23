from features.base import FeatureDetails, Line

AMBIGUOUS = "ambiguous"


class RowLinksDetails(FeatureDetails):
    name = "row_links"

    title = "Row links"

    abstract = "A row named in text, like to-do 648 or message 1712, becomes a link to it in the viewer"

    help = """
        Wherever the viewer shows text, a type followed by a number is marked on the server as a
        link to that row, and the viewer draws it as a chip that opens it. Text in code is left
        alone, and what is saved is always the plain words.

        A file named in text becomes a chip that opens it: a path, a path in backticks that exists,
        or a bare file name when exactly one project file has it. When you name a file that
        several project files share, you are told once to write its path instead.
    """

    lines = [
        Line(
            name=AMBIGUOUS,
            title="{{name}} names {{count}} files in the project",
            brief="write the path so the chat can link it: {{paths}}",
        ),
    ]
