from resources.base import PROJECT
from features.base import FeatureDetails, Line
from features.settings import Setting
from features.groups import Group

VOICE_SET = "voice set"


class FormOfAddressDetails(FeatureDetails):
    explains = 'The agent uses the title, name, and voice you choose. You can change them in your profile.'
    name = "form_of_address"
    group = Group.VOICE
    label = "Tell the agent how to talk to you"
    position = 1
    when = "you write anything the user will read in the chat, or anything into a project: code, text, commit messages, docs and briefs"

    title = "Your title and name"

    abstract = "The agent talks to you in the voice of the profile you choose, by your title and first name, as the profile says."

    help = """
        Every session start, and every start after a compaction, tells the agent how to talk to you, in the voice of
        the profile you choose: Butler, Homie, Colleague, Coach or Squire. Until you choose, it talks as the Butler: your
        title, Sir by default, and your first name, like Sir Example, now and then a 🎩. The name is the one set
        here, or else the first name git knows you by; the title is only ever what you set here. A change here
        reaches the running agent at once.

        A profile holds how the agent talks, what it calls you, its humour (how it answers a meme, a joke,
        criticism or anger: one line in its own manner, then the matter put right) and a sample line. The five
        that ship with the journal are locked; make a copy of one to change it, or write your own.

        The voice changes only the tone of the chat and how the agent addresses you, never the journal's own
        words: even in the chat it says helper, subagent, to-do and environment, whatever voice is active.
        Code, any text written into a project, commit messages, docs, reports and briefs to other agents are
        always in plain language, never in the profile's tone.
    """

    settings = [
        Setting(
            name="title",
            default="Sir",
            title="Title",
            abstract="Leave it empty to use your first name only",
            scope=PROJECT,
        ),
        Setting(
            name="first_name",
            default="",
            title="First name",
            abstract="Leave it empty to use the name git knows you by",
            scope=PROJECT,
        ),
        Setting(
            name="mascot",
            default=True,
            title="Show the voice's mascot on the chat box",
            abstract="While the agent waits, the voice's mascot sits on the edge of the chat's text box and plays a short idle loop",
            scope=PROJECT,
        ),
        Setting(
            name="profile",
            default="",
            title="Profile",
            abstract="The profile the agent talks as; until you choose, it talks as the Butler",
            hidden=True,
            scope=PROJECT,
        ),
    ]

    lines = [
        Line(
            name=VOICE_SET,
            while_waiting=True,
            title="the user changed how you talk to them",
            brief="From now on: {{voice}} Answer this with one opening sentence in the new voice in the chat, so the user hears the change, and add nothing else about it.",
        ),
    ]
