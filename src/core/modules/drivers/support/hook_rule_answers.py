from dataclasses import replace

from engine.time.clock import Clock
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rules import DriverRules
from core.base.driver.hook_event import HookEvent
from core.base.driver.rule_answers import RuleAnswers
from engine.time.timing import Timing
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudge_log import NudgeLog
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.settings.bindings.support.setting_values import SettingValues


class HookRuleAnswers:
    """Asks an agent's rules about one hook before the write transaction opens, so their reads hold no write lock."""

    def __init__(self, rules: DriverRules, choice: SuiteChoice, settings: SettingValues, nudges: NudgeLog, timing: Timing, clock: Clock) -> None:
        self.rules, self.choice, self.settings, self.nudges, self.timing, self.clock = rules, choice, settings, nudges, timing, clock

    def evaluate(self, event: HookEvent, agent: Agent) -> RuleAnswers:
        timestamp = self.clock.timestamp()
        suite, driver = self.choice.suite(), self.choice.driver(agent.role)
        hook = AgentHook(event, agent.id, agent.environment_id, agent.role, driver.name if driver is not None else "", timestamp,
                         suite=suite.name if suite is not None else "", access=agent.access)
        self.timing.stamp("hook_built")
        with self.settings.keep_rows():
            answers = self.rules.ask(hook)
        answers = replace(answers, skipped_lines=self.nudges.skipped_lines(agent.id, answers, timestamp))
        self.timing.stamp("rules_asked")
        return answers
