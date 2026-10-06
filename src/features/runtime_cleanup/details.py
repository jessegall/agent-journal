from features.trigger import MINUTES, Trigger
from features.base import FeatureDetails
from features.settings import Setting
from features.groups import Group


class RuntimeCleanupDetails(FeatureDetails):
    explains = 'The journal deletes old temporary files and trims large logs. You can choose how long quiet session files stay.'
    name = "runtime_cleanup"
    group = Group.ARCHIVE
    label = "Delete old temporary files"
    has_skill = False

    title = "Cleanup"

    aliases = ("housekeeping",)

    abstract = """
        Keeps the runtime folder small: terminal captures and logs are cut to their last lines, and
        files of quiet sessions are deleted.
    """

    help = """
        Once an hour: each session keeps its files in runtime/sessions/<session>; its printed
        capture keeps its last 64 KB and every log its last 1 MB, and a session's folder untouched
        for runtime_cleanup.days (2) is removed whole.
    """

    fixed = True

    trigger = Trigger(every=60, unit=MINUTES)

    settings = [
        Setting(
            name="days",
            default=2,
            title="Delete the files of inactive sessions after",
            unit="days",
        ),
    ]
