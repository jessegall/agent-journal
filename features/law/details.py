from features.base import FeatureDetails


class LawDetails(FeatureDetails):
    name = "law"

    title = "The law"

    abstract = "The immutable dispatch rules the journal ships to every agent and project"

    help = """
        Always on. The laws are handed to every session, kept in AGENTS.md and CLAUDE.md, and
        enforced before a subagent dispatch.
    """

    fixed = True
