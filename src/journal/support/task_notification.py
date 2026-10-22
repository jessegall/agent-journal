import re
from dataclasses import dataclass

NOTIFICATION = re.compile(r"<task-notification>(.*?)</task-notification>", re.S)
FIELD = r"<{name}>(.*?)</{name}>"
REFUSAL = re.compile(r"^\s*(I (can't|cannot|could not|couldn't|am unable|was unable|wasn't able|am not able)|Unable to|I'm unable|I'm not able)", re.I)


@dataclass(frozen=True)
class TaskNotification:
    """What the agent's program tells it of a background subagent's end, in a prompt it sends in: the subagent's id, whether it completed or failed, the one-line summary and its report, what it said last."""

    task_id: str
    status: str
    summary: str
    report: str

    @classmethod
    def parsed(cls, text: str) -> list["TaskNotification"]:
        return [cls(cls.field(body, "task-id"), cls.field(body, "status"), cls.field(body, "summary"), cls.field(body, "result")) for body in NOTIFICATION.findall(text)]

    @staticmethod
    def field(body: str, name: str) -> str:
        match = re.search(FIELD.format(name=name), body, re.S)
        return match.group(1).strip() if match else ""

    def is_failed(self) -> bool:
        return self.status == "failed"

    def is_refusal(self) -> bool:
        return bool(REFUSAL.match(self.report))

    def is_change(self, finished: bool) -> bool:
        return not finished or self.is_failed() or self.is_refusal()

    def first_line(self) -> str:
        return next((line.strip() for line in self.report.splitlines() if line.strip()), "")
