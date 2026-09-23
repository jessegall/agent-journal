from features.base import FeatureDetails
from features.boards.resource import MEANINGS


class BoardsDetails(FeatureDetails):
    name = "boards"
    when = "a board is made, its stages change, or a ticket moves between them"

    title = "Boards"

    abstract = "Named boards of tickets, each with stages of its own"

    help = f"""
        journal board create "<name>" --brief "<what it is for>" --set stages="New,Doing,Review,Done" makes one for the
        whole project. journal board stage <n> "<stage>" adds a stage, and journal board mark <n> "<stage>" <meaning> marks
        it as one of {', '.join(MEANINGS)}: the journal acts on a stage only once it is marked. A ticket sits in one stage of
        its board: journal ticket move <n> "<stage>".
    """
