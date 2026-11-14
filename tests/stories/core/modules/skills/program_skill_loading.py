from datetime import timedelta

from engine.enums.tool_type import ToolType
from core.modules.skills.support.skill_requirement import SkillRequirement
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.skills.due import environment, start, drain_countdown
from core.modules.skills.support.start_skills import SESSION_START_KEY


def test_each_program_names_how_it_loads_a_required_skill(new_story):
    story = environment(new_story)
    story.run(f'setting make {SESSION_START_KEY} \'["journal-notes"]\'')
    story.replace(SkillRequirement, SkillRequirement())
    start(story)
    drain_countdown(story, HookSamples.edit('src/cart.py'), 'journal-notes')
    story.expect_hook_refusal('s-1', HookSamples.edit('src/cart.py'), 'load this first with the Skill tool: journal-notes')
    story.expect_success("skill required", "load this first with the Skill tool: journal-notes", actor=story.agent)
    story.expect_success(f"skill require {story.agent.id} journal-notes", "load this first with the Skill tool: journal-notes")
    skill = HookSamples.tool_use('Skill', ToolType.READ, ['.claude/skills/journal-notes/SKILL.md'], None)
    story.expect_hook_allowed('s-1', skill)
    story.expect_hook_allowed('s-1', HookSamples.edit('src/cart.py'))
    codex = hook_agent(story, story.hook('s-2', HookSamples.session_start().with_fields(program='codex', session='s-2')))
    story.run_listeners()
    story.expect_success("skill required", "read this first: .agents/skills/journal-notes/SKILL.md", actor=codex)
    codex_edit = HookSamples.edit('src/cart.py').with_fields(program='codex', session='s-2')
    for _ in range(4):
        story.run_listeners()
        story.advance(timedelta(seconds=1))
        story.expect_hook_allowed('s-2', codex_edit)
    story.run_listeners()
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal('s-2', codex_edit, 'read this first: .agents/skills/journal-notes/SKILL.md')
