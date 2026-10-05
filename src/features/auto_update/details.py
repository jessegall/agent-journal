from features.trigger import MINUTES, Trigger
from features.base import FeatureDetails, Line
from features.groups import Group
from features.settings import Setting


class AutoUpdateDetails(FeatureDetails):
    name = "auto_update"
    group = Group.UPDATES
    label = "Install updates automatically"
    hint = "Off: the agent is told to install a new version instead"
    has_skill = False

    title = "Automatic updates"

    aliases = ("updates",)


    abstract = "Installs a newer journal by itself, or tells the agent to install it."

    help = """
        Every five minutes each session's worker compares the newest release tag on GitHub with
        the one installed, and a launch checks once before the agent starts, so updates keep
        coming while the server is down.

        With auto-update on, the newest release is installed in the background, one install per
        journal at a time, and the session reloads itself. The setting chooses how big a step
        installs by itself: patches only (2.249.4 to 2.249.5), minor versions too (to 2.250.0), or
        every release (to 3.0.0 and beyond); a bigger one waits on Home. A failed install is filed as a notice
        and tried again after 30 minutes, then 2 hours, then 6. With it off, Home shows a banner
        when a newer release is out, with Update and Update and turn on auto-update, and the agent
        is told to run journal upgrade. The journal's own repository never installs itself.

        A build that cannot start its worker or its server is set aside: the journal goes
        back to the last build that worked.

        A new build reaches a running session by itself: the server and the supervisor reload,
        and the channel restarts in place. When a release changes how the agent itself is
        launched, the supervisor waits until the agent is idle and restarts it in the same
        conversation, and the chat shows a mark saying so.
    """

    trigger = Trigger(every=5, unit=MINUTES)

    settings = [
        Setting(
            name="installs",
            default="always",
            title="Which updates install by themselves",
            abstract="A bigger update waits on Home with an Update button",
            choices=("patches", "minor versions", "always"),
            labels=(("patches", "Patches only"), ("minor versions", "Minor versions too"), ("always", "Every release")),
            examples=(
                ("patches", "2.249.5 installs by itself. 2.250.0 and 3.0.0 wait for you on Home, with an Update button."),
                ("minor versions", "2.249.5 and 2.250.0 install by themselves. 3.0.0 waits for you on Home, with an Update button."),
                ("always", "Every new release installs by itself, whatever its number."),
            ),
        ),
    ]

    lines = [
        Line(
            name="newer",
            title="journal {{latest}} is out, this project runs {{installed}}",
            brief="run journal upgrade to install it",
        ),
        Line(
            name="failed",
            reply_kept=True,
            title="installing journal {{latest}} failed",
            brief="{{why}} - run journal upgrade to try again",
        ),
    ]
