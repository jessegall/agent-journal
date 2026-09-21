from features.trigger import MINUTES
from features.base import Behaviour, FeatureDetails, Line


class UpdatesDetails(FeatureDetails):
    name = "updates"

    title = "Updates"

    abstract = "A newer journal is installed by itself, or the agent is told to install it"

    help = """
        Every half hour of an agent's time the feature compares the version published on GitHub
        with the one installed.

        With install on, a newer version is installed in the background, once per version, and
        the server reloads itself; with it off, or when installing fails, the agent is told to
        run journal upgrade. A journal being developed never installs itself.
    """

    trigger = {"every": 30, "unit": MINUTES}

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
