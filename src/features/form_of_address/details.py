from features.base import FeatureDetails
from features.settings import Setting


class AddressDetails(FeatureDetails):
    name = "form_of_address"

    title = "How the agent addresses you"

    abstract = "The agent calls you by the title you choose, Sir unless you pick another, with your first name when it is known"

    help = """
        Every session start, and every start after a compaction, tells the agent how to address you:
        the title from Settings, Sir by default, followed by your first name when it is known, like
        Sir Jesse. The name is the one set here, or else the first name git knows you by. The title is
        only ever what you set here, never guessed from a name. Now and then, when it fits, the agent answers
        with a sense of humor: a 🎩 when you call it sir, or a funny reaction on a message, never on every one.
    """

    settings = [
        Setting(
            name="title",
            default="Sir",
            title="What the agent calls you",
            abstract="A title such as Sir or Madam, or any word you like; empty uses your name alone",
        ),
        Setting(
            name="first_name",
            default="",
            title="Your first name",
            abstract="Empty uses the first name git knows you by",
        ),
    ]
