from tests.stories.core.support.fixtures import UserJoined


def test_a_template_is_made_with_its_parts_and_shown(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('template make "Find what is missing" --brief "Read the plan against its goal" --applies-to plan --parts "Gaps: what is left out | Tasks: one per gap"',
                         "template 1: Find what is missing", actor=story.user)
    story.expect_ordered_lines("template show 1", "template 1: Find what is missing (for plan)", "Read the plan against its goal", "- Gaps", "- Tasks", actor=story.user)


def test_a_testing_template_names_the_commands_run_at_each_phase_end(new_story):
    story = new_story(fixture=UserJoined)
    story.run('template make "Full suite" --brief "Run everything" --purpose testing --commands "sh scripts/run_tests.sh"', actor=story.user)
    story.expect_text("template show 1", "runs at each phase end: sh scripts/run_tests.sh", actor=story.user)
    story.expect_text("template list", "Full suite (for any, testing)", actor=story.user)
