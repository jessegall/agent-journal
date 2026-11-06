from core.base.driver.tool_type import ToolType
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.skills.due import environment, start


def test_each_program_names_how_it_loads_a_required_skill(new_story):
    story = environment(new_story)
    story.run('setting make journal.core.skills.session-start \'["journal-notes"]\'')
    story.container.bind(SkillRequirement, SkillRequirement())
    start(story)
    story.expect_hook_refusal('s-1', HookSamples.edit('src/cart.py'), 'load this first with the Skill tool: journal-notes')
    story.expect_success("skill required", "load this first with the Skill tool: journal-notes", actor=story.agent)
    story.expect_success(f"skill require {story.agent.id} journal-notes", "load this first with the Skill tool: journal-notes")
    skill = HookSamples.tool_use('Skill', ToolType.READ, ['.claude/skills/journal-notes/SKILL.md'], None)
    story.expect_hook_allowed('s-1', skill)
    story.expect_hook_allowed('s-1', HookSamples.edit('src/cart.py'))
    codex = hook_agent(story, story.hook('s-2', HookSamples.session_start().with_fields(program='codex', session='s-2')))
    story.run_listeners()
    story.expect_success("skill required", "read this first: .agents/skills/journal-notes/SKILL.md", actor=codex)
    story.expect_hook_refusal('s-2', HookSamples.edit('src/cart.py').with_fields(program='codex', session='s-2'), 'read this first: .agents/skills/journal-notes/SKILL.md')
