from features.base import FeatureDetails
from features.settings import Setting


class DesignsDetails(FeatureDetails):
    name = "designs"

    title = "Designs"

    abstract = """
        A design document that always reads as it stands now, with every earlier revision kept
        and readable
    """

    help = """
        journal design create "<name>" starts one. Its latest revision stays open while it is
        worked on: design section, design cut, design update and every edit in the viewer
        change it in place.

        A revision is kept when the user presses Keep this revision, when journal design keep
        runs, or by itself after designs.keep_after_minutes (30) without an edit. The next edit
        opens a new revision copied from the kept one, so nothing kept is ever changed.

        The viewer shows the design as it stands, a row of its revisions to scroll back
        through, and what each revision changed. The revisions are documents underneath: the
        Documents page lists a design once, as its latest revision.
    """

    settings = [
        Setting(
            name="keep_after_minutes",
            default=30,
            title="Keep an open revision after",
            abstract="An open revision is kept by itself when nobody has edited it for this long",
            unit="minutes",
        ),
    ]
