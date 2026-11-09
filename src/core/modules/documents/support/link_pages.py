from argparse import Namespace
from dataclasses import asdict

from core.base.page import Page
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.modules.documents.conditions.first_link_counterpart import FirstLinkCounterpart
from core.modules.documents.conditions.link_counterparts import LinkCounterparts
from core.modules.documents.conditions.link_scope import LinkScope
from core.modules.documents.conditions.link_side import LinkSide
from core.modules.documents.conditions.link_target import LinkTarget
from core.modules.documents.conditions.link_target_counts import LinkTargetCounts
from core.modules.documents.conditions.excludes_plan import ExcludesPlan
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.references.row_ref import RowRef
from core.modules.documents.support.link_counterpart import LinkCounterpart
from core.modules.documents.support.link_endpoint_reader import LinkEndpointReader
from core.modules.documents.support.link_page import LinkPage
from core.modules.documents.support.link_page_json_record import LinkPageJsonRecord
from core.modules.documents.support.link_read import LinkRead
from core.modules.documents.support.row_refs import RowRefs


class LinkPages:
    """Reads one page of the links of a row, as the arguments of `journal link list` ask for it, and writes it as the
    values that command prints."""

    def __init__(self, queries: Queries, row_refs: RowRefs, endpoints: LinkEndpointReader) -> None:
        self.queries, self.row_refs, self.endpoints = queries, row_refs, endpoints

    def read(self, arguments: Namespace) -> LinkPage:
        size = min(arguments.page_size, 50)
        if arguments.page < 1 or size < 1 or arguments.page > 9223372036854775807 // size:
            raise Refusal("use a positive link page and page size within the supported range")
        side = next(side for side in LinkSide if getattr(arguments, side.value))
        reference = self.row_refs.parsed(getattr(arguments, side.value))
        if arguments.excludes_plan and reference.model != "plan":
            raise Refusal("--outside-plan requires a plan")
        scope = LinkScope(reference, side)
        query = self.queries.query(Link).matching(scope)
        types = tuple(dict.fromkeys(arguments.type))
        if types:
            query = query.matching(Among("link_type", types))
        if arguments.excludes_plan:
            query = query.matching(ExcludesPlan(reference))
        counts = LinkTargetCounts(query.scoped(query.select), reference).statement()
        target_counts = {str(row[0]): int(row[1]) for row in query.database.rows(counts)}
        if arguments.target_model:
            model = self.row_refs.model(arguments.target_model)
            if model is None:
                raise Refusal(f"unknown link kind: {arguments.target_model}")
            query = query.matching(LinkTarget(reference, model.model_name))
        counterparts = ()
        if arguments.group_counterparts:
            page = self.counterpart_page(query.matching(FirstLinkCounterpart(query.select, reference)), reference, arguments, size)
            counterparts = tuple(scope.counterpart(link) for link in page.rows)
            links = tuple(query.matching(LinkCounterparts(reference, counterparts)).oldest().limited(size * len(LinkType) * 2))
        else:
            if arguments.first_counterpart:
                raise Refusal("a first counterpart needs --group-counterparts")
            page = query.oldest().page(arguments.page, size)
            links = page.rows
        references = {end for link in links for end in (RowRef(link.source_model, link.source_id), RowRef(link.target_model, link.target_id))}
        endpoints = self.endpoints.read(references)
        rows = tuple(LinkRead(link, endpoints[RowRef(link.source_model, link.source_id)], endpoints[RowRef(link.target_model, link.target_id)]) for link in links)
        groups = tuple(LinkCounterpart(endpoints[counterpart],
                       tuple(sorted({str(link.link_type) for link in links if scope.counterpart(link) == counterpart})),
                       tuple(link.id for link in links if scope.counterpart(link) == counterpart)) for counterpart in counterparts)
        command = f"journal link list --{side} {reference.text} --page {arguments.page + 1} --page-size {size}"
        command += "".join(f" --type {link_type}" for link_type in types)
        if arguments.group_counterparts:
            command += " --group-counterparts"
        if arguments.first_counterpart:
            command += f" --first-counterpart {arguments.first_counterpart}"
        if arguments.excludes_plan:
            command += " --outside-plan"
        if arguments.target_model:
            command += f" --kind {model.model_name}"
        return LinkPage(rows, groups, arguments.page, size, page.total, None if page.is_last else command, target_counts)

    def counterpart_page(self, query: Query[Link], reference: RowRef, arguments: Namespace, size: int) -> Page[Link]:
        if not arguments.first_counterpart:
            return query.oldest().page(arguments.page, size)
        first = self.row_refs.parsed(arguments.first_counterpart)
        priority = query.matching(LinkCounterparts(reference, [first])).oldest().first()
        if priority is None:
            return query.oldest().page(arguments.page, size)
        total = query.count()
        pool = query.matching(Among("id", [priority.id], negated=True)).oldest()
        if arguments.page == 1:
            following = tuple(pool.limited(size - 1)) if size > 1 else ()
            return Page((priority, *following), arguments.page, size, total)
        selected = tuple(pool.rows(pool.select.sliced(size, (arguments.page - 1) * size - 1)))
        return Page(selected, arguments.page, size, total)

    @staticmethod
    def payload(value: LinkPage, output: Output) -> LinkPageJsonRecord:
        rows = [{**output.values(row.link), "source_title": row.source.title, "target_title": row.target.title,
                 "source": asdict(row.source), "target": asdict(row.target)} for row in value.rows]
        return {"rows": rows, "counterparts": [asdict(counterpart) for counterpart in value.counterparts],
                "page": value.page, "page_size": value.page_size, "total": value.total, "has_more": value.next_command is not None,
                "next_page": value.page + 1 if value.next_command is not None else None, "next_command": value.next_command,
                "categories": value.target_counts}

    @staticmethod
    def lines(value: LinkPage) -> list[str]:
        lines = [f"{row.link.source_model}:{row.link.source_id}  {row.link.link_type}  {row.link.target_model}:{row.link.target_id}" for row in value.rows]
        if value.next_command is not None:
            lines.append(value.next_command)
        return lines
