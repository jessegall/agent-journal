from features.base import FeatureDetails, Line
from features.settings import Setting
from features.groups import Group

VOICE_SET = "voice set"


class FormOfAddressDetails(FeatureDetails):
    explains = 'The agent uses the title, name, and voice you choose. You can change them in your profile.'
    name = "form_of_address"
    group = Group.AGENT
    label = "Tell the agent how to talk to you"
    position = 1
    when = "you write anything the user will read in the chat, or anything into a project: code, text, commit messages, docs and briefs"

    title = "Your title and name"

    abstract = "The agent talks to you in the voice of the profile you choose, by your title and first name, as the profile says."

    help = """
        Every session start, and every start after a compaction, tells the agent how to talk to you, in the voice of
        the profile you choose: Butler, Homie, Colleague or Coach. Until you choose, it talks as the Butler: your
        title, Sir by default, and your first name, like Sir Example, now and then a 🎩. The name is the one set
        here, or else the first name git knows you by; the title is only ever what you set here. A change here
        reaches the running agent at once.

        The voice is for your speech in the chat and nowhere else. Code, any text written into a project that
        a person will read, commit messages, docs and briefs to other agents always use plain words: helper and
        subagent, never the profile's word for them, and never the profile's tone.
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
        Setting(
            name="profile",
            default="",
            title="Profile",
            abstract="The profile the agent talks as; until you choose, it talks as the Butler",
            hidden=True,
        ),
    ]

    lines = [
        Line(
            name=VOICE_SET,
            while_waiting=True,
            title="the user changed how you talk to them",
            brief="From now on: {{voice}}",
        ),
    ]
