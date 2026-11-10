from functools import cache
import inspect
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar, Never
from engine.agent.agent_group import AgentGroup
from engine.helper_type.helper_type import HelperType
from core.base.profile.agent_profile import AgentProfile

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.chat.dock_declaration import DockDeclaration
from engine.chat.mark_declaration import MarkDeclaration
from engine.command.command import Command
from engine.command.handler import Handler
from engine.database.migration import Migration
from engine.driver.driver import Driver
from engine.driver.driver_rule import DriverRule
from engine.driver.overlay import Overlay
from engine.driver.suite import Suite
from engine.guard.guard import Guard
from engine.listener.commit_listener import CommitListener
from engine.listener.deletion_listener import DeletionListener
from engine.listener.save_listener import SaveListener
from engine.model.state_addition import StateAddition
from engine.model.view_model import ViewModel
from engine.module.model_declaration import ModelDeclaration
from core.base.provider.provider import Provider
from engine.skill.skill_declaration import SkillDeclaration
from engine.upgrade.version_four_move import VersionFourMove
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_extension import WindowExtension
from engine.subcommand.subcommand import Subcommand
from engine.seed.seeder import Seeder
from engine.subcommand.read_subcommand import ReadSubcommand
from core.base.library.library_share_class import LibraryShareClass
from engine.query.shared_rows import SharedRows
from engine.setting.setting_node import SettingNode
from engine.ticker.tick_handler import TickHandler
from engine.tunnel.tunnel import Tunnel
from engine.driver.block_condition import BlockCondition
from engine.check.step_condition import StepCondition
from engine.performance.performance_tool import PerformanceTool
from engine.template.template_declaration import TemplateDeclaration
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_declaration import InspectorDeclaration

GuardClass = type[Guard[Never]]
ListenerClass = type[DeletionListener[Never]] | type[SaveListener[Never]] | type[CommitListener[Never]]
SubcommandClass = type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]
HandlerClass = type[Handler[Never, object]]

WEB_FOLDER = Path("web") / "dist"


class Module:
    """Declares the models, commands, rules and viewer windows supplied by one module."""

    name: ClassVar[str]
    requires_core: ClassVar[str]
    dependencies: ClassVar[list[str]] = []
    step_conditions: ClassVar[list[type[StepCondition]]] = []
    parent_suite: ClassVar[str | None] = None
    models: ClassVar[list[ModelDeclaration]] = []
    migrations: ClassVar[list[type[Migration]]] = []
    views: ClassVar[list[type[ViewModel]]] = []
    handlers: ClassVar[list[HandlerClass]] = []
    subcommands: ClassVar[list[SubcommandClass]] = []
    guards: ClassVar[Sequence[GuardClass]] = []
    listeners: ClassVar[Sequence[ListenerClass]] = []
    file_events: ClassVar[list[str]] = []
    former_event_keys: ClassVar[dict[str, str]] = {}
    declared_plugin_events: ClassVar[list[str]] = []
    removal: ClassVar[type[Migration] | None] = None
    bindings: ClassVar[dict[type, type]] = {}
    suites: ClassVar[list[type[Suite]]] = []
    drivers: ClassVar[list[type[Driver]]] = []
    overlays: ClassVar[list[type[Overlay]]] = []
    driver_rules: ClassVar[list[type[DriverRule]]] = []
    windows: ClassVar[list[WindowDeclaration]] = []
    window_extensions: ClassVar[list[WindowExtension]] = []
    marks: ClassVar[list[MarkDeclaration]] = []
    block_conditions: ClassVar[list[type[BlockCondition]]] = []
    performance_tools: ClassVar[list[type[PerformanceTool]]] = []
    nudges: ClassVar[list[NudgeDeclaration]] = []
    tick_handlers: ClassVar[list[TickHandler]] = []
    docks: ClassVar[list[DockDeclaration]] = []
    templates: ClassVar[list[TemplateDeclaration]] = []
    buttons: ClassVar[list[ButtonDeclaration]] = []
    button_slots: ClassVar[list[str]] = []
    inspectors: ClassVar[list[InspectorDeclaration]] = []
    added_states: ClassVar[Sequence[StateAddition]] = ()
    helper_types: ClassVar[list[HelperType]] = []
    agent_groups: ClassVar[list[AgentGroup]] = []
    profiles: ClassVar[list[AgentProfile]] = []
    providers: ClassVar[list[type[Provider]]] = []
    settings: ClassVar[Sequence[SettingNode]] = []
    tunnels: ClassVar[list[type[Tunnel]]] = []
    shared_rows: ClassVar[list[type[SharedRows]]] = []
    library_shares: ClassVar[list[type[LibraryShareClass]]] = []
    skills: ClassVar[list[SkillDeclaration]] = []
    seeders: ClassVar[list[type[Seeder]]] = []
    moves: ClassVar[list[type[VersionFourMove]]] = []
    move_reason: ClassVar[str] = ""
    seed_reason: ClassVar[str] = ""

    @classmethod
    def plugin_event_names(cls) -> list[str]:
        if "named_plugin_events" in cls.__dict__:
            return cls.declared_plugin_events
        return getattr(cls, "plugin_moments", cls.declared_plugin_events)

    @classmethod
    def declared_helper_types(cls) -> list[HelperType]:
        return [*cls.helper_types, *(declaration for suite in cls.suites for declaration in suite.helper_types)]

    @classmethod
    def declared_buttons(cls) -> list[ButtonDeclaration]:
        return [*cls.buttons, *(action for inspector in cls.inspectors for action in inspector.slotted_actions())]

    @classmethod
    @cache
    def folder(cls) -> Path:
        return Path(inspect.getfile(cls)).resolve().parent

    @classmethod
    def web_folder(cls) -> Path:
        return cls.folder() / WEB_FOLDER
