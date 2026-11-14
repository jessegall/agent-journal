from dataclasses import replace

from engine.time.clock import Clock
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rules import DriverRules
from engine.driver.hook_event import HookEvent
from engine.driver.rule_answers import RuleAnswers
from engine.performance.timing import Timing
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudge_log import NudgeLog
from core.modules.drivers.support.actor_loader import ActorLoader
from engine.setting.setting_values import SettingValues


class HookRuleAnswers:
    """Asks an agent's rules about one hook before the write transaction opens, so their reads hold no write lock."""

    def __init__(self, rules: DriverRules, loader: ActorLoader, settings: SettingValues, nudges: NudgeLog, timing: Timing, clock: Clock) -> None:
        self.rules, self.loader, self.settings, self.nudges, self.timing, self.clock = rules, loader, settings, nudges, timing, clock

    def evaluate(self, event: HookEvent, agent: Agent) -> RuleAnswers:
        timestamp = self.clock.timestamp()
        actor = self.loader.loaded(agent)
        self.timing.stamp("actor_loaded")
        hook = AgentHook.of_actor(event, actor, timestamp)
        self.timing.stamp("hook_built")
        with self.settings.keep_rows():
            answers = self.rules.ask(hook)
        answers = replace(answers, skipped_lines=self.nudges.skipped_lines(agent.id, answers, timestamp))
        self.timing.stamp("rules_asked")
        return answers
