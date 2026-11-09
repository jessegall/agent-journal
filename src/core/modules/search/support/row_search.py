from collections.abc import Sequence

from core.base.model.model import Model
from core.base.query.conditions.contains_every import ContainsEvery
from core.base.query.conditions.contains_most import ContainsMost
from core.base.query.conditions.excluding import Excluding
from core.base.query.conditions.prefix import Prefix
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.search.support.search_hit import SearchHit
from core.modules.search.support.search_result import SearchResult

HIT_LIMIT_ROWS = 40


class RowSearch:
    """Searches model fields and ranks exact or partial matches."""

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
        model_queries = [self.searchable(model).matching(ContainsEvery(model.search_fields, terms)) for model in search_models]
        hits = [SearchHit.matched(row, terms) for query in model_queries for row in query.newest().limited(HIT_LIMIT_ROWS)]
        total = sum(query.count() for query in model_queries)
        if total or len(terms) < 2:
            return SearchResult(terms, sorted(hits, key=lambda hit: (-hit.rank, -hit.created_at.value.timestamp()))[:HIT_LIMIT_ROWS], total)
        return self.closest(terms, search_models)

    def closest(self, terms: Sequence[str], search_models: Sequence[type[Model]]) -> SearchResult:
        enough = (len(terms) + 1) // 2
        rows = [row for model in search_models for row in self.searchable(model).matching(ContainsMost(model.search_fields, terms, enough)).newest().limited(HIT_LIMIT_ROWS)]
        hits = [SearchHit.matched(row, terms) for row in rows]
        ranked = sorted(hits, key=lambda hit: (-hit.matched_terms, -hit.rank, -hit.created_at.value.timestamp()))
        return SearchResult(terms, ranked[:HIT_LIMIT_ROWS], len(ranked), is_closest=True)

    def searchable(self, model: type[Model]) -> Query[Model]:
        query = self.queries.query(model)
        return query.matching(Excluding(Prefix(model.search_fields[0], model.search_ignored_start))) if model.search_ignored_start else query
