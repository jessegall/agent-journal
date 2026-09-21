from controllers.types import Agents, Notices
from engine.seats import live
from engine.sessions import Sessions
from features.base import Feature, event
from providers import DRIVERS
from resources.base import SYSTEM, titled

PERMISSION = "permission"


class Permissions(Feature):
    name = "permissions"
    title_ = "Permissions"
    abstract_ = "A permission the agent waits on is shown in the chat, with Allow and Deny; a switch runs the agent without permission prompts"
    help_ = "When the agent's terminal asks for permission, the chat shows which call it is for, and Allow or Deny answers the prompt in the terminal. The Skip permission prompts switch in Settings restarts the agent in the same conversation, with or without its skip flag."

    @event("agent.updated")
    def asked(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or agent.subagent:
            return
        notices = Notices(record, actor=SYSTEM)
        open_ = [n for n in notices._standing() if n.data.get("action") == PERMISSION and n.data.get("session") == agent.title]
        asking = agent.asking or {}
        if asking and not open_:
            notices.create(titled(f"Waiting for permission - {asking.get('tool')} {asking.get('said')}"), brief=asking.get("said") or "",
                           tone="warn", session=agent.title, action=PERMISSION)
        elif not asking:
            for notice in open_:
                notices.complete(notice.n, how="answered")

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary()
        seat = next((found for _, found in live(record.root) if primary and found["session"] == primary.title), None)
        driver = DRIVERS.get(seat["provider"]) if seat else None
        args = Sessions(record.root).read(seat["terminal"]).get("args") or [] if seat else []
        return {"skip": bool(record.setting(self.name, {}).get("skip")), "session": seat["session"] if seat else "",
                "running": bool(driver and driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args)),
                "possible": bool(driver and driver.SKIP_ARGS)}
