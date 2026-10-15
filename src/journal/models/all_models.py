from journal.models.agent import Agent
from journal.models.chart import Chart
from journal.models.check import Check
from journal.models.doc import Doc
from journal.models.entry import Entry
from journal.models.environment import Environment
from journal.models.fact import Fact
from journal.models.link import Link
from journal.models.mcp_server import McpServer
from journal.models.message import Message
from journal.models.node import Node
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.question import Question
from journal.models.reaction import Reaction
from journal.models.reminder import Reminder
from journal.models.report import Report
from journal.models.rule import Rule
from journal.models.scoped import Scoped
from journal.models.sequence import Sequence
from journal.models.setting import Setting
from journal.models.task import Task
from journal.models.template import Template
from journal.models.task_log import TaskLog
from journal.models.trigger import Trigger
from journal.models.user import User
from journal.models.worker import Worker


class AllModels:
    """Every model with a table, so the schema can create them."""

    MODELS = (Environment, User, Agent, Task, TaskLog, Plan, Phase, McpServer, Message, Reaction, Question, Fact, Rule, Reminder, Report, Doc, Entry, Setting, Link, Sequence, Worker, Trigger, Check, Template, Chart, Node)
    SCOPED = tuple(model for model in MODELS if issubclass(model, Scoped))
