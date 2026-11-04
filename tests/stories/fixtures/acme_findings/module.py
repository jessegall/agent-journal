from core.base.module.module import Module
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace


class AcmeFindingsModule(Module):
    name = "acme.findings"
    requires_core = ">=5,<6"
    parent_suite = "acme"
    dependencies = ["acme.suite", "journal.core.plans", "journal.core.viewer"]
    button_slots = ["findings.row"]
    windows = [WindowDeclaration("findings.findings", "Findings", "findings.js", WindowLoading.COMPONENT,
                                 place=WindowPlace.PAGE, icon=WindowIcon.PLAN, reads=["plan list", "plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]
