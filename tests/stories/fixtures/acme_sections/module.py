from engine.module.module import Module
from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_icon import WindowIcon
from engine.viewer.window_loading import WindowLoading
from engine.viewer.window_place import WindowPlace


def section(name: str, title: str, entry: str, *slots: str, reads: tuple[str, ...] = ()) -> WindowDeclaration:
    return WindowDeclaration(f"sections.{name}", title, entry, WindowLoading.COMPONENT, place=WindowPlace.SECTION, slots=slots,
                             icon=WindowIcon.WINDOW, reads=reads, skeleton=tuple([SkeletonPart.line()]))


class AcmeSectionsModule(Module):
    name = "acme.sections"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.agents", "journal.core.documents", "journal.core.memories", "journal.core.plans", "journal.core.tasks", "journal.core.viewer", "journal.suites.coding"]
    windows = [section("failing", "Failing", "failing.js", "inspector.plan", reads=tuple(["plan show"])),
               section("undeclared", "Undeclared", "undeclared.js", "inspector.plan", reads=tuple(["plan show"])),
               section("throwing", "Throwing", "throwing.js", "inspector.plan"),
               section("elsewhere", "Elsewhere", "elsewhere.js", "inspector.task", "inspector.doc", "inspector.report", "inspector.agent", "inspector.memory")]
