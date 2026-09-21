from features.base import Behaviour, FeatureDetails, Line


class TagsDetails(FeatureDetails):
    name = "tags"
    title = "Tagging"
    abstract = "A message opens with one tag: one without is answered at once with a message from the journal, and a tag carrying a number runs the command it stands for"
    help = "The tags are settings. tags.names lists them and tags.runs maps a tag to the command it stands for, so [!reply:12] runs journal message reply 12 with the turn as its text, and [!todo=\"the title\"] files a to-do with that title and the turn as its brief. A tag runs once, keyed to the turn it came from; two tags in one turn run in the order they appear; and a refusal comes back as a nudge on the next turn rather than at the moment of acting."
    lines = {"untagged": Line("your last message has no tag", "open every message with one of {{tags}} - a message without one does not reach the chat; just add the tag, never mention tags to the user", lead=True),
             "refused": Line("the {{tag}} tag on {{on}} did not run", "{{said}}"),
             "by tag": Line("reply to message {{n}} with the reply tag", "open your turn with [!reply:{{n}}] and the turn itself becomes the reply, so journal message reply is never needed")}
    behaviours = {"replying": Behaviour("Remind the agent to reply by tag",
                                        "When the agent runs journal message reply, it is told the reply tag does the same")}
