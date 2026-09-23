from features.trigger import MINUTES, Trigger
from features.base import Behaviour, FeatureDetails, Line


class UpdatesDetails(FeatureDetails):
    name = "auto_update"

    title = "Auto-update"

    aliases = ("updates",)


    abstract = "A newer journal is installed by itself, or the agent is told to install it"

    help = """
        Every five minutes the supervisor beside each session compares the version published
        on GitHub with the one installed, so updates keep coming while the server is down.

        With install on, a newer version is installed in the background, once per version, and
        the server reloads itself; with it off, or when installing fails, you are told to
        run journal upgrade. A journal being developed never installs itself.

        A build that cannot start its supervisor or its server is set aside: the journal goes
        back to the last build that worked and never installs that version again.

        A new build reaches a running session by itself: the server and the supervisor reload,
        and the channel restarts in place. When a release changes how the agent itself is
        launched, the supervisor waits until the agent is idle and restarts it in the same
        conversation, and the chat shows a mark saying so.
    """

    trigger = Trigger(every=5, unit=MINUTES)

    behaviours = [
        Behaviour(
            name="install",
            title="Install a newer version by itself",
            abstract="Off, the agent is told to run journal upgrade instead",
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
            title="installing journal {{latest}} failed",
            brief="{{why}} - run journal upgrade to try again",
        ),
    ]
