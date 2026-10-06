from features.base import FeatureDetails


class HelpersDetails(FeatureDetails):
    name = "helpers"
    skill_of = "todos"
    when = "a bounded job goes to a helper on another provider, such as Codex, or a helper reports"

    title = "Helpers"

    abstract = """
        A helper agent on any provider takes one bounded job in an environment of its own, kept out
        of the lists, and its report comes back to the chat
    """

    help = """
        A helper is for work that writes. Work that only reads, such as a review, research or a
        design, goes to your own subagent instead, dispatched with your agent tool: Claude's Agent
        tool, Codex's spawn_agent with an agent_type from .codex/agents. The subagent shows in the
        viewer's agent list and its answer comes back to you.

        journal helper dispatch <name> "<job>" --provider codex --model <model> --brief "<the bounded
        job>" starts a helper in an environment of its own, named after you and the helper, which
        stays out of the environment lists; --worktree gives it a worktree cut from the working
        branch for any job that changes code. The name follows the naming law and the model is
        always named, one the provider offers: a model it does not offer is refused with the list
        of those it does. You are told when it reports: its report shows in the chat as a message from
        it. journal helper say <n> "<text>" sends it a follow-up; journal helper stop <n> ends its
        agent; once its work is taken (journal worktree take) or dropped, journal helper finish <n>
        packs its environment away.
    """
