from collections.abc import Sequence

from core.base.model.model import Model
from core.base.query.conditions.contains_every import ContainsEvery
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.search.support.search_hit import SearchHit
from core.modules.search.support.search_result import SearchResult

HIT_LIMIT_ROWS = 40


class RowSearch:
    """Finds the rows of every model that names its search fields which hold every term, newest first across
    the models, at most 40, with how many hold them in all."""

    def __init__(self, registry: Registry, queries: Queries) -> None:
        self.registry, self.queries = registry, queries

    def searched_models(self) -> dict[str, type[Model]]:
        loaded = [entry.model.loaded() for entry in self.registry.models.values()]
        return {model.cli_name: model for model in loaded if issubclass(model, Model) and model.search_fields}

    def result(self, terms: Sequence[str], model_names: Sequence[str]) -> SearchResult:
        searched = self.searched_models()
        unknown = [name for name in model_names if name not in searched]
        if unknown:
            raise Refusal(f"{unknown[0]} is no model search reads", f"name one of: {', '.join(sorted(searched))}")
        search_models = [searched[name] for name in model_names] or list(searched.values())
        model_queries = [self.queries.query(model).matching(ContainsEvery(model.search_fields, terms)) for model in search_models]
        hits = [SearchHit.matched(row, terms[0]) for query in model_queries for row in query.newest().limited(HIT_LIMIT_ROWS)]
        newest = sorted(hits, key=lambda hit: hit.created_at, reverse=True)[:HIT_LIMIT_ROWS]
        return SearchResult(terms, newest, sum(query.count() for query in model_queries))
