from features.base import FeatureDetails
from features.settings import Setting
from features.groups import Group


class FormOfAddressDetails(FeatureDetails):
    name = "form_of_address"
    group = Group.AGENT
    label = "Address you by title"
    has_skill = False

    title = "How the agent addresses you"

    abstract = "The agent calls you by the title you choose, Sir unless you pick another, with your first name when it is known"

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
            abstract="Empty: your first name alone",
        ),
        Setting(
            name="first_name",
            default="",
            title="First name",
            abstract="Empty: the name git knows you by",
        ),
    ]
