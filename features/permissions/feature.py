from controllers.types import Agents, Notices
from engine.seats import live
from engine.sessions import Sessions
from features.base import Feature, Line, event
from providers import DRIVERS
from resources.base import SYSTEM

PERMISSION = "permission"


class Permissions(Feature):
    name = "permissions"
    title_ = "Permissions"
    abstract_ = "A permission the agent waits on is shown in the chat, with Allow and Deny; a switch runs the agent without permission prompts"
    help_ = "When the agent's terminal asks for permission, the chat shows which call it is for, and Allow or Deny answers the prompt in the terminal. The Skip permission prompts switch in Settings restarts the agent in the same conversation, with or without its skip flag."
    lines = {"waiting": Line("Waiting for permission - {{tool}} {{said}}", "{{said}}")}

    @event("agent.updated")
    def asked(self, event, record) -> None:
        agent = self.agent(event, record)
        if not agent or agent.subagent:
            return
        open_ = [n for n in self.standing(record, Notices) if n.data.get("action") == PERMISSION and n.data.get("session") == agent.title]
        asking = agent.asking or {}
        if asking and not open_:
            self.journal.notice(record, "waiting", tool=asking.get("tool") or "", said=asking.get("said") or "", tone="warn", session=agent.title, action=PERMISSION)
        elif not asking:
            for notice in open_:
                self.journal.clear(record, notice, "answered")

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary()
        seat = next((found for _, found in live(record.root) if primary and found["session"] == primary.title), None)
        driver = DRIVERS.get(seat["provider"]) if seat else None
        args = Sessions(record.root).read(seat["terminal"]).get("args") or [] if seat else []
        return {"skip": bool(record.setting(self.name, {}).get("skip")), "session": seat["session"] if seat else "",
                "running": bool(driver and driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args)),
                "possible": bool(driver and driver.SKIP_ARGS)}
