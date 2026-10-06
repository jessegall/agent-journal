from features.base import FeatureDetails
from features.settings import Setting
from features.groups import Group


class RevisionsDetails(FeatureDetails):
    explains = 'The journal keeps earlier versions of documents. You can read a previous version or keep the current one.'
    name = "revisions"
    group = Group.RECORDS
    label = "Keep document revisions"
    skill_of = "reports"
    when = "a doc is edited, kept or read at an earlier revision"

    title = "Revisions"

    aliases = ("designs",)

    abstract = """
        Every document keeps its revisions: it always reads as it stands now, and each earlier
        revision stays readable
    """

    help = """
        Edit a doc as usual; each edit changes its open revision in place. When a version is worth keeping, run
        journal doc keep <n>: the next edit then opens a new revision copied from the kept one, so nothing kept is ever
        changed. A revision is also kept when the user presses Keep this revision, or by itself after
        revisions.keep_after_minutes (30) without an edit.

        journal doc revisions <n> lists them, journal doc revision <n> <k> shows one, and journal doc cut <n> "<part>" removes
        a part. The viewer shows a row of revisions above the document, and what each one changed.
    """

    settings = [
        Setting(
            name="keep_after_minutes",
            default=30,
            title="Save an open revision after no edits for",
            unit="minutes",
        ),
    ]
