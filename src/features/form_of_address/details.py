from features.base import FeatureDetails
from features.settings import Setting
from features.groups import Group


class FormOfAddressDetails(FeatureDetails):
    name = "form_of_address"
    group = Group.AGENT
    label = "Call you by a title"
    has_skill = False

    title = "Your title and name"

    abstract = "The agent calls you by the title you choose (Sir unless you change it) and your first name."

    help = """
        Every session start, and every start after a compaction, tells the agent how to address you, as a good butler would, in its answers and now and then, never in every message:
        the title from Settings, Sir by default, followed by your first name when it is known, like
        Sir Example. The name is the one set here, or else the first name git knows you by. The title is
        only ever what you set here, never guessed from a name. Now and then, when it fits, the agent answers
        with a sense of humor: a 🎩 when you call it sir, or a funny reaction on a message, never on every one.
    """

    settings = [
        Setting(
            name="title",
            default="Sir",
            title="Title",
            abstract="Leave it empty to use your first name only",
        ),
        Setting(
            name="first_name",
            default="",
            title="First name",
            abstract="Leave it empty to use the name git knows you by",
        ),
    ]
