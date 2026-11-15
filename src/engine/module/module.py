from functools import cache
import inspect
from engine.module.story_step import StoryStep
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar, Never
from engine.agent.groups.agent_group import AgentGroup
from engine.helper_type.helper_type import HelperType
from engine.profile.agent_profile import AgentProfile
from engine.module.ask_topic import AskTopic
from engine.driver.agent_state import AgentState

from engine.driver.nudge_declaration import NudgeDeclaration
from engine.chat.dock_declaration import DockDeclaration
from engine.chat.mark_declaration import MarkDeclaration
from engine.command.command import Command
from engine.command.handler import Handler
from engine.database.migration import Migration
from engine.driver.driver import Driver
from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.contracts.wake_cause import WakeCause
from engine.agent_machine.driver import Driver as AgentDriver
from engine.agent_machine.needs.fact_source import FactSource
from engine.agent_machine.needs.need_source import NeedSource
from engine.model.model import Model
from engine.driver.driver_rule import DriverRule
from engine.driver.overlay import Overlay
from engine.guard.guard import Guard
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.deletion_listener import DeletionListener
from engine.listener.save_listener import SaveListener
from engine.model.state_addition import StateAddition
from engine.model.view_model import ViewModel
from engine.module.model_declaration import ModelDeclaration
from engine.provider.provider import Provider
from engine.skill.skill_declaration import SkillDeclaration
from engine.upgrade.version_four_move import VersionFourMove
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window import Window
from engine.viewer.window_extension import WindowExtension
from engine.subcommand.subcommand import Subcommand
from engine.seed.seeder import Seeder
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.library.library_share_class import LibraryShareClass
from engine.query.rows.shared_rows import SharedRows
from engine.setting.setting_node import SettingNode
from engine.setting.setting_list import SettingList
from engine.ticker.tick_handler import TickHandler
from engine.tunnel.tunnel import Tunnel
from engine.driver.block_condition import BlockCondition
from engine.check.step_condition import StepCondition
from engine.performance.performance_tool import PerformanceTool
from engine.template.template_declaration import TemplateDeclaration
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_declaration import InspectorDeclaration

GuardClass = type[Guard[Never]]
ListenerClass = type[DeletionListener[Never]] | type[SaveListener[Never]] | type[CommitListener[Never]]
SubcommandClass = type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]
HandlerClass = type[Handler[Never, object]]

WEB_FOLDER = Path("web") / "dist"


class Module:
    """Declares the models, commands, rules and viewer windows supplied by one module."""

    name: ClassVar[str]
    requires_engine: ClassVar[str]
    dependencies: ClassVar[list[str]] = []
    step_conditions: ClassVar[list[type[StepCondition]]] = []
    models: ClassVar[list[ModelDeclaration | type[ModelDeclaration]]] = []
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
    drivers: ClassVar[list[type[Driver]]] = []
    overlays: ClassVar[list[type[Overlay]]] = []
    driver_rules: ClassVar[list[type[DriverRule]]] = []
    agent_states: ClassVar[list[type[AgentState]]] = []
    windows: ClassVar[list[WindowDeclaration | type[Window]]] = []
    window_extensions: ClassVar[list[WindowExtension | type[WindowExtension]]] = []
    marks: ClassVar[list[MarkDeclaration | type[MarkDeclaration]]] = []
    block_conditions: ClassVar[list[type[BlockCondition]]] = []
    agent_drivers: ClassVar[list[type[AgentDriver]]] = []
    needs: ClassVar[list[type[NeedSource]]] = []
    facts: ClassVar[list[type[FactSource]]] = []
    policies: ClassVar[list[type[Policy]]] = []
    lines: ClassVar[list[type[LineSource]]] = []
    transforms: ClassVar[list[type[Transform]]] = []
    effects: ClassVar[list[type[Effect]]] = []
    wake_causes: ClassVar[list[type[WakeCause]]] = []
    subjects: ClassVar[list[type[Model]]] = []
    agent_listeners: ClassVar[list[type[AgentListener[object]]]] = []
    performance_tools: ClassVar[list[type[PerformanceTool]]] = []
    nudges: ClassVar[list[NudgeDeclaration | type[NudgeDeclaration]]] = []
    tick_handlers: ClassVar[list[TickHandler | type[TickHandler]]] = []
    ask_topics: ClassVar[list[AskTopic | type[AskTopic]]] = []
    docks: ClassVar[list[DockDeclaration | type[DockDeclaration]]] = []
    templates: ClassVar[list[TemplateDeclaration | type[TemplateDeclaration]]] = []
    buttons: ClassVar[list[ButtonDeclaration | type[ButtonDeclaration]]] = []
    button_slots: ClassVar[list[str]] = []
    inspectors: ClassVar[list[InspectorDeclaration | type[InspectorDeclaration]]] = []
    added_states: ClassVar[Sequence[StateAddition]] = ()
    helper_types: ClassVar[list[type[HelperType]]] = []
    agent_groups: ClassVar[list[AgentGroup | type[AgentGroup]]] = []
    profiles: ClassVar[list[AgentProfile]] = []
    providers: ClassVar[list[type[Provider]]] = []
    story_steps: ClassVar[list[type[StoryStep]]] = []
    settings: ClassVar[Sequence[SettingNode | type[SettingList]]] = []
    tunnels: ClassVar[list[type[Tunnel]]] = []
    shared_rows: ClassVar[list[type[SharedRows]]] = []
    library_shares: ClassVar[list[type[LibraryShareClass]]] = []
    skills: ClassVar[list[SkillDeclaration | type[SkillDeclaration]]] = []
    seeders: ClassVar[list[type[Seeder]]] = []
    moves: ClassVar[list[type[VersionFourMove]]] = []
    move_reason: ClassVar[str] = ""
    seed_reason: ClassVar[str] = ""

    @classmethod
    def plugin_event_names(cls) -> list[str]:
        if "named_plugin_events" in cls.__dict__:
            return cls.declared_plugin_events
        return getattr(cls, "plugin_moments", cls.declared_plugin_events)

    # a window written as a class gives its declaration; an inline declaration is its own
    @classmethod
    def window_declarations(cls) -> list[WindowDeclaration]:
        return [window.declaration() if isinstance(window, type) and issubclass(window, Window) else window for window in cls.windows]

    # an extension written as a class gives its declaration; an inline extension is its own
    @classmethod
    def extension_declarations(cls) -> list[WindowExtension]:
        return [extension.declared() if isinstance(extension, type) else extension for extension in cls.window_extensions]

    # a skill written as a class gives its declaration; an inline declaration is its own
    @classmethod
    def skill_declarations(cls) -> list[SkillDeclaration]:
        return [skill.declared() if isinstance(skill, type) else skill for skill in cls.skills]

    # a group written as a class gives its declaration; an inline group is its own
    @classmethod
    def group_declarations(cls) -> list[AgentGroup]:
        return [group.declared() if isinstance(group, type) else group for group in cls.agent_groups]

    # a template written as a class gives its declaration; an inline declaration is its own
    @classmethod
    def template_declarations(cls) -> list[TemplateDeclaration]:
        return [template.declared() if isinstance(template, type) else template for template in cls.templates]

    # a setting list written as a class gives its values and groups; a value or group listed inline is its own
    @classmethod
    def setting_nodes(cls) -> list[SettingNode]:
        return [node for entry in cls.settings for node in (entry.nodes() if isinstance(entry, type) else [entry])]

    # a dock written as a class gives its declaration; an inline dock is its own
    @classmethod
    def dock_declarations(cls) -> list[DockDeclaration]:
        return [dock.declared() if isinstance(dock, type) else dock for dock in cls.docks]

    # a model declared as a class gives its declaration; a short inline declaration is its own
    @classmethod
    def model_declarations(cls) -> list[ModelDeclaration]:
        return [model.declared() if isinstance(model, type) else model for model in cls.models]

    # a mark written as a class gives its declaration; an inline mark is its own
    @classmethod
    def mark_declarations(cls) -> list[MarkDeclaration]:
        return [mark.declared() if isinstance(mark, type) else mark for mark in cls.marks]

    # a nudge written as a class gives its declaration; an inline nudge is its own
    @classmethod
    def nudge_declarations(cls) -> list[NudgeDeclaration]:
        return [nudge.declared() if isinstance(nudge, type) else nudge for nudge in cls.nudges]

    # a tick handler written as a class gives its declaration; an inline handler is its own
    @classmethod
    def tick_handler_declarations(cls) -> list[TickHandler]:
        return [handler.declared() if isinstance(handler, type) else handler for handler in cls.tick_handlers]

    # a button written as a class gives its declaration; an inline button is its own
    @classmethod
    def button_declarations(cls) -> list[ButtonDeclaration]:
        return [button.declared() if isinstance(button, type) else button for button in cls.buttons]

    # an inspector written as a class gives its declaration; an inline inspector is its own
    @classmethod
    def inspector_declarations(cls) -> list[InspectorDeclaration]:
        return [inspector.declared() if isinstance(inspector, type) else inspector for inspector in cls.inspectors]

    # an ask topic written as a class gives its declaration; an inline topic is its own
    @classmethod
    def ask_topic_declarations(cls) -> list[AskTopic]:
        return [topic.declared() if isinstance(topic, type) else topic for topic in cls.ask_topics]

    @classmethod
    def declared_buttons(cls) -> list[ButtonDeclaration]:
        return [*cls.button_declarations(), *(action for inspector in cls.inspector_declarations() for action in inspector.slotted_actions())]

    @classmethod
    @cache
    def folder(cls) -> Path:
        return Path(inspect.getfile(cls)).resolve().parent

    @classmethod
    def web_folder(cls) -> Path:
        return cls.folder() / WEB_FOLDER
