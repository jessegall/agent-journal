from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class MemoryTypeSwitch(Model):
    """Whether a memory type is on in the environments that run one suite, or, with suite "*", in every suite."""

    model_name = "memory_type_switch"
    cli_name = "memory-type-switch"

    creator_id: int
    type: str
    suite: str
    module: str
    is_on: bool
