from features.base import FeatureDetails
from features.settings import Setting


class RevisionsDetails(FeatureDetails):
    name = "revisions"
    when = "a doc is edited, kept or read at an earlier revision"

    title = "Revisions"

    aliases = ("designs",)

    abstract = """
        Every document keeps its revisions: it always reads as it stands now, and each earlier
        revision stays readable
    """

    help = """
        Every edit to a doc changes its open revision in place. A revision is kept when the user
        presses Keep this revision, when journal doc keep <n> runs, or by itself after
        revisions.keep_after_minutes (30) without an edit; the next edit opens a new revision
        copied from the kept one, so nothing kept is ever changed. journal doc revisions <n>
        lists them, journal doc revision <n> <k> shows one, and journal doc cut <n> "<part>"
        removes a part. The viewer shows a row of revisions above the document to step back
        through, and what each one changed.
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
