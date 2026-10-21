from journal.models.agent import Agent
from journal.models.check import Check
from journal.models.doc import Doc
from journal.models.dump import Dump
from journal.models.migrated_row import MigratedRow
from journal.models.statistic import Statistic
from journal.models.version3_migration import Version3Migration
from journal.models.entry import Entry
from journal.models.environment import Environment
from journal.models.fact import Fact
from journal.models.link import Link
from journal.models.mcp_server import McpServer
from journal.models.message import Message
from journal.models.notice import Notice
from journal.models.phase import Phase
from journal.models.plugin import Plugin
from journal.models.dashboard_row import DashboardRow
from journal.models.plan import Plan
from journal.models.plan_review import PlanReview
from journal.models.suggestion import Suggestion
from journal.models.question import Question
from journal.models.edit import Edit
from journal.models.reaction import Reaction
from journal.models.reminder import Reminder
from journal.models.report import Report
from journal.models.rule import Rule
from journal.models.scoped import Scoped
from journal.models.secret import Secret
from journal.models.sequence import Sequence
from journal.models.setting import Setting
from journal.models.share import Share
from journal.models.phone import Phone
from journal.models.pairing_code import PairingCode
from journal.models.task import Task
from journal.models.template import Template
from journal.models.task_log import TaskLog
from journal.models.trigger import Trigger
from journal.models.command_output import CommandOutput
from journal.models.user import User
from journal.models.worker import Worker


class AllModels:
    """Every model with a table, so the schema can create them."""

    MODELS = (Environment, User, Agent, Task, TaskLog, Plan, PlanReview, Phase, McpServer, Message, Reaction, Edit, Question, Fact, Rule, Reminder, Report, Doc, Dump, Entry, Setting, Link, Sequence, Worker, Trigger, Check, Template, Notice, Secret, Plugin, DashboardRow, CommandOutput, Version3Migration, MigratedRow, Share, Statistic, Phone, PairingCode, Suggestion)
    SCOPED = tuple(model for model in MODELS if issubclass(model, Scoped))
