from engine.module.model_declaration import ModelDeclaration
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_query import SequenceQuery
from core.modules.sequences.support.built_subcommands import BUILT


class SequenceModelDeclaration(ModelDeclaration):
    """How the module declares Sequence."""

    model = Sequence
    query = SequenceQuery
    excluded_subcommands = BUILT
