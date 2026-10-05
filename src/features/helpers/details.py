from features.base import FeatureDetails
from features.groups import Group


class HelpersDetails(FeatureDetails):
    name = "helpers"
    group = Group.SESSIONS
    label = "Allow helper agents"
    skill_of = "todos"
    when = "a bounded job goes to a helper on another provider, such as Codex, or a helper reports"

    title = "Helpers"

    abstract = """
        A helper agent on any provider takes one bounded job in an environment of its own, kept out
        of the lists, and its report comes back to the chat
    """

    help = """
        journal helper dispatch <name> "<job>" --provider codex --model <model> --brief "<the bounded
        job>" starts a helper in an environment of its own, named after you and the helper, which
        stays out of the environment lists; --worktree gives it a worktree cut from the working
        branch for any job that changes code. The name follows the naming law and the model is
        always named. You are told when it reports: its report shows in the chat as a message from
        it. journal helper say <n> "<text>" sends it a follow-up; journal helper stop <n> ends its
        agent; once its work is taken (journal worktree take) or dropped, journal helper finish <n>
        packs its environment away.
    """
