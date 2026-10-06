from features.base import FeatureDetails
from features.groups import Group


class HelpersDetails(FeatureDetails):
    explains = "The agent can start a helper for a bounded job. You can see the helper's progress and report."
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
        A helper is for work that writes. Work that only reads, such as a review, research or a
        design, goes to your own subagent instead, also when it reviews a branch in a nested
        checkout, dispatched with your agent tool: Claude's Agent tool, Codex's spawn_agent with an
        agent_type from .codex/agents. The subagent shows in the viewer's agent list and its answer
        comes back to you.

        journal helper dispatch <name> "<job>" --provider codex --model <model> --brief "<the bounded
        job>" starts a helper in an environment of its own, named after you and the helper, which
        stays out of the environment lists; --worktree gives it a worktree cut from the working
        branch for any job that changes code, and --checkout <path> launches it instead in a git
        checkout inside the project, such as a nested repository on its own branch. The name follows the naming law and the model is
        always named, one the provider offers: a model it does not offer is refused with the list
        of those it does. You are told when it reports: its report shows in the chat as a message from
        it. journal helper say <n> "<text>" sends it a follow-up; journal helper stop <n> ends its
        agent; once its work is taken (journal worktree take) or dropped, journal helper finish <n>
        packs its environment away.

        --todos <n>,<n> hands the helper rows of your own list: they are its alone, so nobody else
        starts or closes them. The helper marks one with journal helper done <n> --how "<what
        landed>": it shows as done, waiting for its merge, and closes once its worktree is taken.
        Stopping the helper, or its turn ending in an error, gives back the rows it has not
        finished; finishing it gives back the rest.
    """
