from engine.model.assignable import Assignable
from engine.query.queries import Queries
from engine.registry.registry import Registry
from core.modules.assignments.errors.unassignable_model_refusal import UnassignableModelRefusal


class AssignableRows:
    """Finds the row a command names by the command line name of its model and its id, among the models that
    declare themselves assignable; any other model is refused with the names of those that can be assigned."""

    def __init__(self, registry: Registry, queries: Queries) -> None:
        self.registry, self.queries = registry, queries

    def assignable_models(self) -> dict[str, type[Assignable]]:
        models = {cli_name: entry.model_class() for cli_name, entry in self.registry.models.items()}
        return {cli_name: model for cli_name, model in models.items() if issubclass(model, Assignable)}

    def find(self, cli_name: str, row_id: int) -> Assignable:
        models = self.assignable_models()
        if cli_name not in models:
            raise UnassignableModelRefusal(cli_name, sorted(models))
        return self.queries.query(models[cli_name]).find(row_id)
