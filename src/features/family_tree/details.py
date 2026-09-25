from features.base import FeatureDetails


class FamilyTreeDetails(FeatureDetails):
    name = "family_tree"
    has_skill = False

    title = "Agent family tree"

    abstract = """
        One graph of which agent started which, which dispatched which subagent, and which agents
        messaged each other, across every environment of the project
    """

    help = """
        Every environment made for a ticket, a plan or a role records the environment it was
        launched from, every agent's subagents are kept on its row, and the messages agents send
        each other are read from their transcripts. The viewer draws them as one tree in a window
        opened from the top bar.
    """
