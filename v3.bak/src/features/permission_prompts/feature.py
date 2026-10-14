from declaring.registries import LAUNCH_ARGS
from controllers.types import Agents
from framework.seating import live_seat, sessions_of
from events.agents import AgentReported
from events.permission_prompts import PermissionAnswered, PermissionAsked
from expects import Dispatches, Given, Refused, Updated, Wrote, nothing
from framework.base import Feature
from framework.journal import Journal
from features.permission_prompts.commands import AnswerPermission
from features.permission_prompts.details import PermissionsDetails
from features.permission_prompts.handlers import ClearTheAsk, ShowTheAsk, SpotPermissionAsk
from framework.skipping import Skipping, launch_args, skipped, skipping_now
from resources.base import SYSTEM
from resources.types import AgentRow, Notice


class PermissionPrompts(Feature):
    details = PermissionsDetails

    def register(self, journal: Journal) -> None:
        if launch_args not in LAUNCH_ARGS:
            LAUNCH_ARGS.append(launch_args)
        journal.events.listen(AgentReported, SpotPermissionAsk(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"asking": {"tool": "Bash", "call": "rm -rf build"}})])
                >> Dispatches(PermissionAsked(agent=1, session="claude-1", tool="Bash", call="rm -rf build")),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"asking": {"tool": "Bash", "call": "rm -rf build"}}),
                                                Notice(n=2, data={"action": "permission", "session": "claude-1"})])
                >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1"), Notice(n=2, data={"action": "permission", "session": "claude-1"})])
                >> Dispatches(PermissionAnswered(notice=2)),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"parent": "claude-0", "asking": {"tool": "Bash", "call": "ls"}})])
                >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"asking": {"tool": "Bash", "call": "ls"}}), Notice(n=2, data={"action": "permission", "session": "claude-2"})])
                >> Dispatches(PermissionAsked(agent=1, session="claude-1", tool="Bash", call="ls")),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"asking": {"tool": "Bash", "call": "ls"}}), Notice(n=2, completed=1.0, data={"action": "permission", "session": "claude-1"})])
                >> Dispatches(PermissionAsked(agent=1, session="claude-1", tool="Bash", call="ls")),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1"), Notice(n=2, data={"action": "permission", "session": "claude-1"}), Notice(n=3, data={"action": "permission", "session": "claude-1"})])
                >> Dispatches(PermissionAnswered(notice=2)) & Dispatches(PermissionAnswered(notice=3)),
        ])
        journal.events.handle(PermissionAsked, ShowTheAsk(), expects=[
            Given(PermissionAsked(agent=1, session="claude-1", tool="Bash", call="rm -rf build"), rows=[AgentRow(n=1, title="claude-1")])
                >> Wrote(Notice(title="Waiting for permission - Bash rm -rf build", data={"action": "permission", "session": "claude-1"})),
        ])
        journal.events.handle(PermissionAnswered, ClearTheAsk(), expects=[
            Given(PermissionAnswered(notice=2), rows=[Notice(n=2, data={"action": "permission", "session": "claude-1"})]) >> Updated(Notice(n=2), outcome="answered"),
        ])
        journal.commands.add("agent", AnswerPermission(), expects=[
            Given((Agents, "worker", "maybe")) >> Refused("answer allow or deny: journal agent permit <environment> allow"),
            Given((Agents, "worker", "allow")) >> Refused("the permissions of worker are not yours to answer: only the orchestrating agent of the environment that launched it answers them"),
        ])

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary_to_read()
        pair = live_seat(record, primary.title) if primary else None
        seat = pair[1] if pair else None
        args = list(sessions_of(record).read(seat.terminal).args) if seat else []
        skipping = skipping_now(seat.provider, args) if seat else Skipping()
        return {"skip": skipped(record), "session": seat.session if seat else "",
                "running": skipping.running, "possible": skipping.possible}

