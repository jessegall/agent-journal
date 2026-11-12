from collections.abc import Sequence

from engine.model.model import Model
from engine.query.conditions.contains_every import ContainsEvery
from engine.query.conditions.contains_most import ContainsMost
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.prefix import Prefix
from engine.query.queries import Queries
from engine.query.query import Query
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
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
        model_queries = {model: self.searchable(model).matching(ContainsEvery(model.search_fields, terms)) for model in search_models}
        total = sum(query.count() for query in model_queries.values())
        if total or len(terms) < 2:
            return SearchResult(terms, self.ranked_hits(model_queries, terms), total)
        return self.closest(terms, search_models)

    @staticmethod
    def ranked_hits(model_queries: dict[type[Model], Query[Model]], terms: Sequence[str]) -> list[SearchHit]:
        """The best hits, the models of the highest rank first and the newest rows first within a rank: a lower rank
        loads rows only for the places a higher one left, so no row is loaded that could not be shown."""
        hits: list[SearchHit] = []
        for rank in sorted({model.search_rank for model in model_queries}, reverse=True):
            places = HIT_LIMIT_ROWS - len(hits)
            if not places:
                break
            ranked = [SearchHit.matched(row, terms) for model, query in model_queries.items() if model.search_rank == rank for row in query.newest().limited(places)]
            hits.extend(sorted(ranked, key=lambda hit: -hit.created_at.value.timestamp())[:places])
        return hits

    def closest(self, terms: Sequence[str], search_models: Sequence[type[Model]]) -> SearchResult:
        hits: dict[tuple[str, int], SearchHit] = {}
        for words in range(len(terms) - 1, (len(terms) + 1) // 2 - 1, -1):
            for model in search_models:
                for row in self.searchable(model).matching(ContainsMost(model.search_fields, terms, words)).newest().limited(HIT_LIMIT_ROWS):
                    hits.setdefault((row.cli_name, row.id), SearchHit.matched(row, terms))
            if len(hits) >= HIT_LIMIT_ROWS:
                break
        ranked = sorted(hits.values(), key=lambda hit: (-hit.matched_terms, -hit.rank, -hit.created_at.value.timestamp()))
        return SearchResult(terms, ranked[:HIT_LIMIT_ROWS], len(ranked), is_closest=True)

    def searchable(self, model: type[Model]) -> Query[Model]:
        query = self.queries.query(model)
        return query.matching(Excluding(Prefix(model.search_fields[0], model.search_ignored_start))) if model.search_ignored_start else query
