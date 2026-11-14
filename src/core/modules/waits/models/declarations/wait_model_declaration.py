from engine.module.model_declaration import ModelDeclaration
from core.modules.waits.commands.end_wait.end_wait import EndWait
from core.modules.waits.commands.resume_wait.resume_wait import ResumeWait
from core.modules.waits.models.wait import Wait


class WaitModelDeclaration(ModelDeclaration):
    """How the module declares Wait."""

    model = Wait
    commands = [EndWait, ResumeWait]
    excluded_subcommands = ["make"]
