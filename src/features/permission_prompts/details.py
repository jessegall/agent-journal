from features.base import FeatureDetails, Line
from features.groups import Group
from features.settings import Setting


class PermissionsDetails(FeatureDetails):
    explains = "The journal brings the agent's permission requests into the chat. You can allow or deny each request there."
    name = "permission_prompts"
    group = Group.CHAT
    label = "Show permission prompts in the chat"
    hint = "With Allow and Deny buttons"
    has_skill = False

    title = "Permission prompts"

    aliases = ("permissions",)

    speaks_while_waiting = True

    settings = [Setting(name="skip", default=True, title="The agent works without asking permission", hidden=True, runs_commands=True)]

    abstract = """
        A permission the agent waits on is shown in the chat, with Allow and Deny; a switch runs
        the agent without permission prompts
    """

    help = """
        When your terminal asks for permission, the chat shows which call it is for, and
        Allow or Deny answers the prompt in the terminal.

        In an environment a helper or a ticket's agent works in, a permission request goes to the
        orchestrating agent that launched it, when that environment runs on auto in orchestrator
        mode: the agent is told which call it is and answers with journal agent permit. Nothing
        then waits on you, and the agent's cell says it waits on the orchestrator.

        You run without permission prompts unless the Skip permission prompts switch in
        Settings is turned off; flipping it restarts you in the same conversation, with or
        without your skip flag.
    """

    lines = [
        Line(
            name="waiting",
            title="Waiting for permission - {{tool}} {{call}}",
            brief="{{call}}",
        ),
        Line(
            name="routed",
            title="{{agent}} waits for permission: {{tool}} {{call}}",
            brief="Answer it with journal agent permit {{agent}} allow, or journal agent permit {{agent}} deny.",
        ),
    ]
