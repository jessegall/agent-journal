
from features import trigger
from engine.journal_calls import calls
from features.parts import AgentContext, ToolInterceptor
from engine.gates import Runs
from features.skill_loading.catalogue import has_read_every_load, loaded_at, loaded_before_compaction, teaching_command
from features.skill_loading.required import outstanding, require
from engine.reach import Reach



class RequireCommandSkill(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.ASYNC

    def intercept(self, context: AgentContext, call) -> str:
        found = next((made for command in call.commands for made in calls(command) if made.noun), None)
        skill = teaching_command(context.record.root.parent, found.noun) if found else ""
        if not skill:
            return ""
        row = context.agent.row
        since = trigger.last(context.record, row.title, context.feature.name).since
        at = loaded_at(row).get(skill, 0.0)
        if (not at or at < since) and skill not in loaded_before_compaction(row):
            require(context.record, row.title, {skill: since})
        return ""


class RefuseUntilLoaded(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.SYNC
    limit = "most_refusals"
    steps_aside = "steps_aside"

    def intercept(self, context: AgentContext, call) -> str:
        missing = outstanding(context.record, context.agent.row)
        if not missing or not has_read_every_load(context.agent.row):
            return ""
        return context.feature.line_text("required", skills=", ".join(missing), loads=", ".join(context.provider.skill_load(name) for name in missing))
