from features.base import Behaviour, FeatureDetails, Line


class TagsDetails(FeatureDetails):
    name = "command_tags"

    title = "Command tags"

    aliases = ("tags",)

    abstract = """
        Everything the agent writes reaches the chat, and a tag carrying a number or a name
        runs the command it stands for
    """

    help = """
        A message without a tag is a plain message in the chat.

        tags.runs maps a tag to the command it stands for, so [!reply:12] runs
        journal message reply 12 with the turn as its text, and [!todo="the title"] files a
        to-do with that title and the turn as its brief. [!fact="the claim"] and [!rule="the ruling"]
        file a fact or a rule the same way.

        The first word names the target; named arguments follow it in any order, as in
        [!rule="the ruling", keywords=("git", "branch")], and reach the command as --set.

        A tag runs once, keyed to the turn it came from; two tags in one turn run in the order
        they appear; and a refusal comes back as a nudge on the next turn rather than at the
        moment of acting.
    """

    lines = [
        Line(
            name="refused",
            title="the {{tag}} tag on {{on}} did not run",
            brief="{{error}} - add what is missing to the tag itself",
        ),
        Line(
            name="by tag",
            title="reply to message {{n}} with the reply tag",
            brief="""
                open your turn with [!reply:{{n}}] and the turn itself becomes the reply,
                so journal message reply is never needed
            """,
        ),
    ]

    behaviours = [
        Behaviour(
            name="replying",
            title="Remind the agent to reply by tag",
            abstract="When the agent runs journal message reply, it is told the reply tag does the same",
        ),
    ]
