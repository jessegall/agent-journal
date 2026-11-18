from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class HelperSteer(EnvironmentScoped, Model):
    """What a parent added to the open job of a busy helper, and the helper's answer once it took it in."""

    model_name = "helper_steer"
    cli_name = "helper-steer"

    environment_id: int = 0
    helper_id: int
    job_id: int
    text: str
    answer: str | None = None

    def answered(self, answer: str) -> "HelperSteer":
        return self.changed(answer=answer)

    def report_part(self) -> str:
        return f"Steer {self.id}: {self.text}\nAnswered: {self.answer}"
