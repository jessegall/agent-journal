from resources.base import PROJECT
from features.base import Behaviour, FeatureDetails, Line
from features.triggers.resource import DOES
from features.groups import Group


class TriggersDetails(FeatureDetails):
    explains = 'The journal watches for words you choose and starts the matching action. You can edit or test each trigger.'
    name = "triggers"
    group = Group.SHARED_RECORDS
    scope = PROJECT
    label = "Triggers"
    hint = "Words you choose, and what happens when they come up"
    when = "the user wants words watched for, or a trigger fires"

    title = "Triggers"

    speaks_while_waiting = True

    abstract = "Words you choose, and what the journal does when they come up."

    help = f"""
        journal trigger create "<what it is for>" --set words="git push,force" --set
        does=nudge --set text="<what to say>" writes one. words_in says where the words are
        matched: text, commands, both (the default), everything, or user for only what the user writes.

        does is one of {', '.join(DOES)}. A message reaches the chat as if the user wrote it, a
        nudge and an instruction are said to you alone, and a deny refuses the tool call
        with the trigger's text as the reason. In your own chat text a deny cannot unsay the words, so it is
        marked and you are told. A start does nothing of its own: it starts the sequences whose starts_on
        names it (trigger:<n>), which is how a sequence starts on words or a command.
    """

    behaviours = [
        Behaviour(
            name="watching",
            title="Run a trigger when its word appears",
        ),
    ]

    lines = [
        Line(
            name="nudge",
            title="{{title}}",
            brief="{{text}}",
        ),
        Line(
            name="instruct",
            title="do this now: {{title}}",
            brief="{{text}}",
        ),
        Line(
            name="denied",
            title="your message used words a trigger denies: {{title}}",
            brief="{{text}}",
        ),
    ]
