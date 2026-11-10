from engine.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace

from .note_plan_handler import NotePlanHandler
from .note_plan_subcommand import NotePlanSubcommand


class AcmePlanNotesModule(Module):
    name = "acme.plan_notes"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.plans", "journal.core.viewer", "journal.suites.coding"]
    handlers = [NotePlanHandler]
    subcommands = [NotePlanSubcommand]
    buttons = [ButtonDeclaration("plan_notes.note", tuple(["row.plan"]), "Note it", "plan-notes add {row_id}", icon="plan")]
    windows = [WindowDeclaration("plan_notes.notes", "Notes", "notes.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION,
                                 slots=tuple(["inspector.plan"]), icon=WindowIcon.PLAN, reads=["plan show"], events=["plan.*"],
                                 skeleton=tuple([SkeletonPart.line()]))]
