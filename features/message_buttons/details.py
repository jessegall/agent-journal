from features.base import FeatureDetails


class ButtonsDetails(FeatureDetails):
    name = "message_buttons"

    title = "Buttons on messages"

    aliases = ("buttons",)

    abstract = "A message the agent writes can carry buttons, each running one journal command when the user presses it"

    help = """
        journal message create "Ready when you are" --set buttons='[{"label": "Okay, start",
        "type": "plan", "n": 3, "action": "approve"}]'. A button runs that one command and
        nothing else; a button naming a type or an action that does not exist is dropped when
        the message is written.

        A button goes once it is pressed, and the message says which one; "again": true keeps it
        there to be pressed as often as the user likes.
    """
