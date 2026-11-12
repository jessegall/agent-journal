from engine.module.suite import Suite
from engine.module.module import Module
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace

from .note_plan_handler import NotePlanHandler
from .note_plan_subcommand import NotePlanSubcommand


class AcmePlanNotesModule(Module):
    name = "acme.plan_notes"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans", "journal.core.viewer", "journal.suites.coding"]
    handlers = [NotePlanHandler]
    subcommands = [NotePlanSubcommand]
    buttons = [ButtonDeclaration("plan_notes.note", tuple(["row.plan"]), "Note it", "plan-notes add {row_id}", icon="plan")]
    windows = [WindowDeclaration("plan_notes.notes", "Notes", "notes.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION,
                                 slots=tuple(["inspector.plan"]), icon=WindowIcon.PLAN, reads=["plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]


class AcmePlanNotesModuleJoining(Suite):
    name = "acme.plan_notes"
    joins = "coding"
    modules = [AcmePlanNotesModule]
