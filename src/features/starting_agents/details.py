from features.base import FeatureDetails
from features.settings import Setting
from features.groups import Group


class StartingAgentsDetails(FeatureDetails):
    explains = 'You can start an agent in an environment from the viewer. The journal opens its session and tracks its work.'
    name = "starting_agents"
    group = Group.SESSIONS
    label = "Start agents from the viewer"
    hint = "The Start button opens an agent in an environment's own terminal"
    has_skill = False

    title = "Starting agents"

    abstract = "The viewer's Start button, and journal environment launch, open an agent in an environment's own terminal"

    help = """
        Always on: the user starts an agent in an environment from the sidebar or when making a new
        environment, and journal environment stop ends it. Only the user starts one; an agent that
        asks is refused. With wake_on_message on, a message the user writes in an environment where
        no agent runs starts one there, resuming the conversation the environment last had on the
        same provider, so the same agent wakes and reads the message next.
    """

    fixed = True

    settings = [
        Setting(
            name="wake_on_message",
            default=False,
            title="Start the agent again when you send a message",
            abstract="Only when no agent is running",
        ),
    ]
