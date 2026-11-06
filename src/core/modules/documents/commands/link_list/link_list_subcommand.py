from argparse import ArgumentParser, Namespace
from dataclasses import asdict

from core.base.caller.caller import Caller
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.conditions.link_counterparts import FirstLinkCounterpart, LinkCounterparts
from core.modules.documents.conditions.link_scope import LinkScope, LinkSide
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.link_endpoint import LinkEndpointReader
from core.modules.documents.support.link_page import LinkPage, LinkRead, LinkCounterpart
from core.modules.documents.support.row_ref import RowRef
from core.modules.documents.support.row_refs import RowRefs


class LinkListSubcommand(ReadSubcommand[LinkPage]):
    """Reads bounded relation pages or distinct counterparts with their matching relation labels."""

    cli_name = "link"
    name = "list"

    def __init__(self, queries: Queries, row_refs: RowRefs, endpoints: LinkEndpointReader) -> None:
        self.queries, self.row_refs, self.endpoints = queries, row_refs, endpoints

    def arguments(self, parser: ArgumentParser) -> None:
        ends = parser.add_mutually_exclusive_group(required=True)
        ends.add_argument("--source")
        ends.add_argument("--target")
        ends.add_argument("--row")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--page-size", type=int, default=25)
        parser.add_argument("--type", type=LinkType, choices=tuple(LinkType), action="append", default=[])
        parser.add_argument("--group-counterparts", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> LinkPage:
        size = min(arguments.page_size, 50)
        if arguments.page < 1 or size < 1 or arguments.page > 9223372036854775807 // size:
            raise Refusal("use a positive link page and page size within the supported range")
        side = next(side for side in LinkSide if getattr(arguments, side.value))
        reference = self.row_refs.parsed(getattr(arguments, side.value))
        scope = LinkScope(reference, side)
        query = self.queries.query(Link).matching(scope)
        types = tuple(dict.fromkeys(arguments.type))
        if types:
            query = query.matching(Among("link_type", types))
        counterparts = ()
        if arguments.group_counterparts:
            page = query.matching(FirstLinkCounterpart(query.select, reference)).oldest().page(arguments.page, size)
            counterparts = tuple(scope.counterpart(link) for link in page.rows)
            links = tuple(query.matching(LinkCounterparts(reference, counterparts)).oldest().limited(size * len(LinkType) * 2))
        else:
            page = query.oldest().page(arguments.page, size)
            links = page.rows
        references = {end for link in links for end in (RowRef(link.source_model, link.source_id), RowRef(link.target_model, link.target_id))}
        endpoints = self.endpoints.read(references)
        rows = tuple(LinkRead(link, endpoints[RowRef(link.source_model, link.source_id)], endpoints[RowRef(link.target_model, link.target_id)]) for link in links)
        groups = tuple(LinkCounterpart(endpoints[counterpart],
                       tuple(sorted({str(link.link_type) for link in links if scope.counterpart(link) == counterpart})),
                       tuple(link.id for link in links if scope.counterpart(link) == counterpart)) for counterpart in counterparts)
        command = f"journal link list --{side} {reference.text} --page {arguments.page + 1} --page-size {size}"
        command += "".join(f" --type {kind}" for kind in types)
        if arguments.group_counterparts:
            command += " --group-counterparts"
        return LinkPage(rows, groups, arguments.page, size, page.total, None if page.is_last else command)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, LinkPage):
            return
        rows = [{**output.values(row.link), "source_title": row.source.title, "target_title": row.target.title,
                 "source": asdict(row.source), "target": asdict(row.target)} for row in value.rows]
        lines = [f"{row.link.source_model}:{row.link.source_id}  {row.link.link_type}  {row.link.target_model}:{row.link.target_id}" for row in value.rows]
        if value.next_command is not None:
            lines.append(value.next_command)
        output.write("\n".join(lines), {"rows": rows, "counterparts": [asdict(counterpart) for counterpart in value.counterparts],
                     "page": value.page, "page_size": value.page_size, "total": value.total, "has_more": value.next_command is not None,
                     "next_page": value.page + 1 if value.next_command is not None else None, "next_command": value.next_command})
