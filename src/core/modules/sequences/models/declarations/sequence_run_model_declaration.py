from engine.module.model_declaration import ModelDeclaration
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.built_subcommands import RUN_BUILT


class SequenceRunModelDeclaration(ModelDeclaration):
    """How the module declares SequenceRun."""

    model = SequenceRun
    query = SequenceRunQuery
    excluded_subcommands = RUN_BUILT
