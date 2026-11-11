from collections.abc import Mapping, Sequence
from typing import TYPE_CHECKING, ClassVar

from engine.viewer.layout_preset import LayoutPreset
from engine.viewer.layout_shape import LayoutShape
from engine.agent.agent_policy import AgentPolicy
from engine.helper_type.helper_type import HelperType

if TYPE_CHECKING:
    from engine.module.module import Module


class Suite:
    """The base of every suite: a swappable set of drivers above the core, with the modules it lists (its own
    module first), the suites it requires, a
    default driver per role, whether it takes complete control, the other modules' overlays it then includes,
    the viewer windows its environments show, the default layout of each viewer page, per driver where one
    is named, the layouts it offers per page in the picker, and the kinds of helper it registers."""

    name: ClassVar[str]
    modules: ClassVar[Sequence[type[Module]]] = []
    requires: ClassVar[Sequence[str]] = []
    defaults: ClassVar[Mapping[str, str]] = {}
    complete_control: ClassVar[bool] = False
    included_overlays: ClassVar[Sequence[str]] = []
    windows: ClassVar[Sequence[str]] = []
    layouts: ClassVar[Mapping[str, LayoutShape]] = {}
    presets: ClassVar[Mapping[str, Sequence[LayoutPreset]]] = {}
    task_assigner: ClassVar[type | None] = None
    agent_policy: ClassVar[AgentPolicy] = AgentPolicy()
    helper_types: ClassVar[Sequence[HelperType]] = []
