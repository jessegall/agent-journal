from core.modules.drivers.models.helper_job import NEW_SESSION_LAUNCH, RESUMED_SESSION_LAUNCH, HelperJob

FIRST_JOB = HelperJob(id=4, session_agent_id=1, creator_id=1, tool_key="s-1", profile="journal-researcher", program_model="sonnet", program="claude", description="Reads a file",
                      instruction="Read src/cart.py", new_session=True)


def test_a_job_that_began_a_new_session_is_named_fresh_and_one_that_did_not_resumed():
    assert FIRST_JOB.occupant_launch == NEW_SESSION_LAUNCH == "fresh"
    assert FIRST_JOB.changed(new_session=False).occupant_launch == RESUMED_SESSION_LAUNCH == "resumed"


def test_the_next_job_of_a_helper_is_keyed_by_its_session_and_begins_as_resumed():
    next_job = FIRST_JOB.next_job("s-1", "claude", "sonnet", "Read src/tax.py", "Read src/tax.py", "", 1)
    assert (next_job.tool_key, next_job.new_session, next_job.id) == ("s-1:4", False, 0)
