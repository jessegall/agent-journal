from engine.module.suite import Suite
from engine.module.module import Module
from engine.viewer.button_declaration import ButtonCondition, ButtonDeclaration
from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace

from .note_plan_handler import NotePlanHandler
from .note_plan_subcommand import NotePlanSubcommand


class AcmeFindingsModule(Module):
    name = "acme.findings"
    requires_core = ">=5,<6"
    dependencies = ["acme.suite", "journal.core.plans", "journal.core.viewer"]
    handlers = [NotePlanHandler]
    subcommands = [NotePlanSubcommand]
    button_slots = ["findings.row"]
    buttons = [ButtonDeclaration("findings.note", tuple(["findings.row"]), "Note the plan", "findings note {row_id}",
                                 condition=ButtonCondition("state", tuple(["ready"])))]
    windows = [WindowDeclaration("findings.findings", "Findings", "findings.js", WindowLoading.COMPONENT,
                                 place=WindowPlace.PAGE, icon=WindowIcon.PLAN, reads=["plan list", "plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]


class AcmeFindingsModuleJoining(Suite):
    name = "acme.findings"
    joins = "acme"
    modules = [AcmeFindingsModule]
