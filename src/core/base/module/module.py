from functools import cache
import inspect
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar, Never
from core.base.agent_type import AgentType
from core.base.profile.agent_profile import AgentProfile

from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.command.command import Command
from core.base.command.handler import Handler
from core.base.database.migration import Migration
from core.base.driver.driver import Driver
from core.base.driver.driver_rule import DriverRule
from core.base.driver.overlay import Overlay
from core.base.driver.suite import Suite
from core.base.guard.guard import Guard
from core.base.listener.commit_listener import CommitListener
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.save_listener import SaveListener
from core.base.model.state_addition import StateAddition
from core.base.model.view_model import ViewModel
from core.base.module.model_declaration import ModelDeclaration
from core.base.provider.provider import Provider
from core.base.skill.skill_declaration import SkillDeclaration
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_extension import WindowExtension
from core.base.subcommand.subcommand import Subcommand
from core.base.seed.seeder import Seeder
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.library.library_share import LibraryShare
from core.base.model.model import Model
from core.base.query.shared_rows import SharedRows
from core.base.setting.setting_node import SettingNode
from core.base.ticker.tick_handler import TickHandler
from core.base.tunnel.tunnel import Tunnel
from core.base.driver.block_condition import BlockCondition
from core.base.performance.performance_tool import PerformanceTool
from core.base.template.template_declaration import TemplateDeclaration
from core.base.viewer.button_declaration import ButtonDeclaration

ListenerClass = type[DeletionListener] | type[SaveListener] | type[CommitListener]
SubcommandClass = type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]
HandlerClass = type[Handler[Never, object]]

WEB_FOLDER = Path("web") / "dist"


class Module:
    """Declares the models, commands, rules and viewer windows supplied by one module."""

    name: ClassVar[str]
    requires_core: ClassVar[str]
    dependencies: ClassVar[list[str]] = []
    parent_suite: ClassVar[str | None] = None
    models: ClassVar[list[ModelDeclaration]] = []
    migrations: ClassVar[list[type[Migration]]] = []
    views: ClassVar[list[type[ViewModel]]] = []
    handlers: ClassVar[list[HandlerClass]] = []
    subcommands: ClassVar[list[SubcommandClass]] = []
    guards: ClassVar[list[type[Guard]]] = []
    listeners: ClassVar[list[ListenerClass]] = []
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
    added_states: ClassVar[Sequence[StateAddition]] = ()
    agent_types: ClassVar[list[AgentType]] = []
    profiles: ClassVar[list[AgentProfile]] = []
    providers: ClassVar[list[type[Provider]]] = []
    settings: ClassVar[Sequence[SettingNode]] = []
    tunnels: ClassVar[list[type[Tunnel]]] = []
    shared_rows: ClassVar[list[type[SharedRows]]] = []
    library_shares: ClassVar[list[type[LibraryShare[Model]]]] = []
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
    @cache
    def folder(cls) -> Path:
        return Path(inspect.getfile(cls)).resolve().parent

    @classmethod
    def web_folder(cls) -> Path:
        return cls.folder() / WEB_FOLDER
