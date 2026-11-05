from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.updates.models.enums.update_step import UpdateStep


@dataclass(frozen=True, kw_only=True)
class ReleaseInstall(Model):
    """An installation attempt, kept separately from releases confirmed as installed."""

    model_name = "release_install"
    cli_name = "release-install"

    creator_id: int
    checksum: str
    tag: str
    code_version: str
    step: UpdateStep = UpdateStep.PROOF
    detail: str = ""
