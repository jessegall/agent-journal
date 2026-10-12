from agents.terminal import LAUNCH_ARGS
from controllers.types import Agents
from engine.seats import live_session
from engine.sessions import Sessions
from events.agents import AgentReported
from expects import Given, Refused, Unchanged, Updated, Wrote
from features.base import Feature
from features.journal import Journal
from features.permission_prompts.commands import AnswerPermission
from features.permission_prompts.details import PermissionsDetails
from features.permission_prompts.handlers import ShowWaitingPermission
from features.permission_prompts.skipping import launch_args, skipped
from providers import DRIVERS
from resources.base import SYSTEM
from resources.types import AgentRow, Notice


class PermissionPrompts(Feature):
    details = PermissionsDetails

    def register(self, journal: Journal) -> None:
        if launch_args not in LAUNCH_ARGS:
            LAUNCH_ARGS.append(launch_args)
        journal.events.handler(ShowWaitingPermission(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"asking": {"tool": "Bash", "call": "rm -rf build"}})])
                >> Wrote(Notice(title="Waiting for permission - Bash rm -rf build", data={"action": "permission", "session": "claude-1"})),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"asking": {"tool": "Bash", "call": "rm -rf build"}}),
                                                Notice(n=2, data={"action": "permission", "session": "claude-1"})])
                >> Unchanged(),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1"), Notice(n=2, data={"action": "permission", "session": "claude-1"})])
                >> Updated(Notice(n=2), outcome="answered"),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"parent": "claude-0", "asking": {"tool": "Bash", "call": "ls"}})])
                >> Unchanged(),
        ])
        journal.commands.add("agent", AnswerPermission(), expects=[
            Given((Agents, "worker", "maybe")) >> Refused("answer allow or deny: journal agent permit <environment> allow"),
            Given((Agents, "worker", "allow")) >> Refused("the permissions of worker are not yours to answer: only the orchestrating agent of the environment that launched it answers them"),
        ])

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary_to_read()
        pair = live_session(record.root, primary.title) if primary else None
        seat = pair[1] if pair else None
        driver = DRIVERS.get(seat.provider) if seat else None
        args = list(Sessions(record.root).read(seat.terminal).args) if seat else []
        return {"skip": skipped(record), "session": seat.session if seat else "",
                "running": bool(driver and driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args)),
                "possible": bool(driver and driver.SKIP_ARGS)}

