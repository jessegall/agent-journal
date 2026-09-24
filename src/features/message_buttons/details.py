from features.base import FeatureDetails


class ButtonsDetails(FeatureDetails):
    name = "message_buttons"
    when = "a message you write should offer the user buttons"

    title = "Buttons on messages"

    aliases = ("buttons",)

    speaks_while_waiting = True

    abstract = "A message the agent writes can carry buttons, each running one journal command when the user presses it"

    help = """
        journal message create "Ready when you are" --set buttons='[{"label": "Okay, start",
        "type": "plan", "n": 3, "action": "approve"}]'. A button runs that one command and
        nothing else; a button naming a type or an action that does not exist is dropped when
        the message is written.

        A button goes once it is pressed, and the message says which one; "again": true keeps it
        there to be pressed as often as the user likes.

        A document or a report you write can carry buttons too, with --set buttons when you create it.
        A button with "say" instead of a command sends that text to you as the user's message about
        the row, a shortcut for typing it: give a proposal {"label": "Accept this proposal", "say":
        "I accept this proposal"} and {"label": "Change it first", "say": "I want changes first"} when
        a choice from the user is what comes next.
    """
