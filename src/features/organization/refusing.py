from events.asking import RowWriting
from features.organization.delegation import missing
from receiving import Refuser
from resources.base import Refused
from resources.types import Todo
from serving import ReadRows


class ReportCoversOutputs(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, todos: ReadRows[Todo]) -> None:
        fields = dict(event.fields)
        reported = fields.get("reported")
        if event.type != "todo" or event.action != "update" or not isinstance(reported, dict):
            return
        role = todos.role_of(todos.peek(fields["n"]))
        if role is None:
            return
        lacking = missing(role.outputs, str(reported.get("how", "")))
        if lacking:
            raise Refused(f"{role.name}'s report covers {', '.join(role.outputs)}; it does not mention {', '.join(lacking)}")
