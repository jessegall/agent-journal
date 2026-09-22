from features.base import FeatureDetails, Line


class PermissionsDetails(FeatureDetails):
    name = "permission_prompts"

    title = "Permission prompts"

    aliases = ("permissions",)

    speaks_while_waiting = True

    abstract = """
        A permission the agent waits on is shown in the chat, with Allow and Deny; a switch runs
        the agent without permission prompts
    """

    help = """
        When the agent's terminal asks for permission, the chat shows which call it is for, and
        Allow or Deny answers the prompt in the terminal.

        The agent runs without permission prompts unless the Skip permission prompts switch in
        Settings is turned off; flipping it restarts the agent in the same conversation, with or
        without its skip flag.
    """

    lines = [
        Line(
            name="waiting",
            title="Waiting for permission - {{tool}} {{call}}",
            brief="{{call}}",
        ),
    ]
