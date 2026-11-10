from engine.module.module import Module
from core.base.viewer.button_declaration import ButtonCondition, ButtonDeclaration
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace

from .note_plan_handler import NotePlanHandler
from .note_plan_subcommand import NotePlanSubcommand


class AcmeFindingsModule(Module):
    name = "acme.findings"
    requires_core = ">=5,<6"
    parent_suite = "acme"
    dependencies = ["acme.suite", "journal.core.plans", "journal.core.viewer"]
    handlers = [NotePlanHandler]
    subcommands = [NotePlanSubcommand]
    button_slots = ["findings.row"]
    buttons = [ButtonDeclaration("findings.note", tuple(["findings.row"]), "Note the plan", "findings note {row_id}",
                                 condition=ButtonCondition("state", tuple(["ready"])))]
    windows = [WindowDeclaration("findings.findings", "Findings", "findings.js", WindowLoading.COMPONENT,
                                 place=WindowPlace.PAGE, icon=WindowIcon.PLAN, reads=["plan list", "plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]
