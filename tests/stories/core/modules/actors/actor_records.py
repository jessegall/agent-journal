def test_the_core_actor_exists_after_the_first_sync(new_story):
    story = new_story()
    story.expect_success("actor show 1", "type: core", "name: core")


def test_a_user_actor_is_made_and_listed_beside_the_core(new_story):
    story = new_story()
    actor_id = story.new_row_id('actor make user "Ada"')
    story.expect_success(f"actor show {actor_id}", "type: user", "name: Ada", "creator_id: 1")
    story.expect_success("actor list --type user", f"{actor_id}  user  Ada")


def test_a_second_actor_of_one_type_and_name_is_refused(new_story):
    story = new_story()
    story.run('actor make user "Ada"')
    story.expect_refusal('actor make user "Ada"', "an actor with that type, name exists already")
