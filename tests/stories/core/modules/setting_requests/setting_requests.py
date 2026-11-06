from tests.stories.core.support.fixtures import AgentStarted

SETTING = "journal.core.project-rules.agents-make-rules"
AGENT_SETTING = "journal.core.settings.backup-minutes"
REQUEST = f'setting request {SETTING} on --reason "Rules need no card" --environment main'
QUESTION_WAITING = "question 1 waits for the user's answer"


def test_the_main_agent_asks_a_person_to_change_a_setting_with_the_old_and_new_value_and_the_reason(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success(REQUEST, QUESTION_WAITING, actor=story.agent)
    story.expect_text("question show 1", "Agents make rules without approval", "from False to True", "Reason: Rules need no card", "state: open", actor=story.user)
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", actor=story.user)


def test_a_person_approving_the_question_sets_the_setting(new_story):
    story = new_story(fixture=AgentStarted)
    story.run(REQUEST, actor=story.agent)
    story.expect_success("question answer 1 --answer 'Yes, approve'", "state: answered", actor=story.user)
    story.expect_text(f"setting show {SETTING} --environment main", "value: True", actor=story.user)


def test_a_person_refusing_the_question_leaves_the_setting_as_it_was(new_story):
    story = new_story(fixture=AgentStarted)
    story.run(REQUEST, actor=story.agent)
    story.expect_success("question answer 1 --answer No", "state: answered", actor=story.user)
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", actor=story.user)


def test_a_request_with_the_project_flag_sets_the_setting_for_the_project(new_story):
    story = new_story(fixture=AgentStarted)
    story.run(f'setting request {SETTING} on --reason "Rules need no card" --project', actor=story.agent)
    story.run("question answer 1 --answer 'Yes, approve'", actor=story.user)
    story.expect_text(f"setting show {SETTING} --environment main", "value: True", "from: project", actor=story.user)


def test_a_person_cannot_make_the_request(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(REQUEST, "only an agent asks for a setting", actor=story.user)
    story.expect_absent("question list", "Agents make rules", actor=story.user)


def test_a_setting_an_agent_may_set_itself_is_not_asked_for(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'setting request {AGENT_SETTING} 30 --reason "Copy more often" --environment main', f"an agent may set {AGENT_SETTING} itself", actor=story.agent)
    story.expect_absent("question list", "backup", actor=story.user)


def test_a_request_with_no_reason_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'setting request {SETTING} on --reason " " --environment main', "say why the setting should change", actor=story.agent)
    story.expect_absent("question list", "Agents make rules", actor=story.user)


def test_a_value_of_the_wrong_type_is_refused_before_a_question_is_asked(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal(f'setting request {SETTING} maybe --reason "Rules need no card" --environment main', f"{SETTING} is a", actor=story.agent)
    story.expect_absent("question list", "Agents make rules", actor=story.user)


def test_the_agent_cannot_answer_the_question_it_asked_but_may_close_it(new_story):
    story = new_story(fixture=AgentStarted)
    story.run(REQUEST, actor=story.agent)
    story.expect_refusal("question answer 1 --answer 'Yes, approve'", "only a person answers question 1", actor=story.agent)
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", actor=story.user)
    story.expect_success("question close 1", "state: closed", actor=story.agent)
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", actor=story.user)


def test_no_agent_can_skip_the_refusal_that_keeps_the_answer_with_a_person(new_story):
    story = new_story(fixture=AgentStarted)
    story.run(REQUEST, actor=story.agent)
    story.expect_refusal('refusal skip setting-requests.person-answers --reason "I need it" --environment main', "safety refusal", actor=story.agent)
    story.expect_refusal("question answer 1 --answer 'Yes, approve'", "only a person answers question 1", actor=story.agent)
