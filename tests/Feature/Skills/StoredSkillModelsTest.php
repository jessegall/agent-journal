<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Support\ActorIdentity;
use App\Skills\Conditions\Conditions;
use App\Skills\Exceptions\SkillRevisionImmutable;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillRequest;
use App\Skills\Models\SkillRevision;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\StoredSkillWrites;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use Illuminate\Support\Facades\Schema;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Stored skills keep a numbered identity and immutable revisions; a request id remembers what it produced.
 */
final class StoredSkillModelsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['skill_requests', 'skill_revisions', 'skills', 'number_groups'];

    public function test_the_three_tables_exist_and_a_skill_gets_a_number(): void
    {
        foreach (['skills', 'skill_revisions', 'skill_requests'] as $table) {
            $this->assertTrue(Schema::hasTable($table), $table);
        }

        $first = Skill::create(SkillKey::from('user-review-notes'), $this->author(), null);
        $second = Skill::create(SkillKey::from('user-other-notes'), $this->author(), null);

        $this->assertGreaterThan(0, $first->number);
        $this->assertSame($first->number + 1, $second->number);
    }

    public function test_revisions_append_in_order_keep_their_content_and_refuse_updates(): void
    {
        $skill = Skill::create(SkillKey::from('user-review-notes'), $this->author(), SkillContextResolver::ENVIRONMENT);
        $writes = $this->writes();
        $first = $writes->appendRevision($skill, $this->draft('First.'), Conditions::everyone(), $this->author());
        $second = $writes->appendRevision(
            $skill,
            $this->draft('Second.'),
            Conditions::dispatchesWork(),
            $this->author(),
        );

        $this->assertSame([1, 2], [$first->revision, $second->revision]);
        $this->assertSame($second->id, $skill->current_revision_id);
        $this->assertSame('First.', SkillRevision::numbered($skill, 1)->sections[0]->content);
        $this->assertSame(
            Conditions::dispatchesWork()->toArray(),
            SkillRevision::currentOf($skill)->conditionThrough($this->app->make(ConditionTree::class))->toArray(),
        );

        $restored = $this->writes()->restoreFrom($skill, $first, Conditions::everyone(), $this->author());
        $this->assertSame(3, $restored->revision);
        $this->assertSame($first->input_digest, $restored->input_digest);

        $first->name = 'Changed';
        $this->expectException(SkillRevisionImmutable::class);

        $first->save();
    }

    public function test_a_request_id_remembers_its_input_digest_and_result(): void
    {
        $skill = Skill::create(SkillKey::from('user-review-notes'), $this->author(), null);
        $revision = $this->writes()->appendRevision(
            $skill,
            $this->draft('First.'),
            Conditions::everyone(),
            $this->author(),
        );
        SkillRequest::create($this->author(), 'request-1', $this->draft('First.')->digest(), $revision);

        $earlier = SkillRequest::earlier($this->author(), 'request-1');

        $this->assertNotNull($earlier);
        $this->assertTrue($earlier->sentWith($this->draft('First.')->digest()));
        $this->assertFalse($earlier->sentWith($this->draft('Other.')->digest()));
        $this->assertNull(SkillRequest::earlier(TestActors::userIdentity(9), 'request-1'));
    }

    public function test_visibility_keeps_another_environment_out(): void
    {
        Skill::create(SkillKey::from('user-everywhere'), $this->author(), null);
        Skill::create(SkillKey::from('user-here'), $this->author(), SkillContextResolver::ENVIRONMENT);
        Skill::create(SkillKey::from('user-elsewhere'), $this->author(), 'other');

        $this->assertSame(
            ['user-everywhere', 'user-here'],
            array_map(fn (Skill $skill) => $skill->key, Skill::activeIn(SkillContextResolver::ENVIRONMENT, 10)),
        );
        $this->assertCount(3, Skill::allForMaintenance(10));
    }

    private function author(): ActorIdentity
    {
        return TestActors::userIdentity(7);
    }

    private function draft(string $text): SkillDraft
    {
        return new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', $text)],
            '{"type":"everyone","version":1}',
        );
    }

    private function writes(): StoredSkillWrites
    {
        return $this->app->make(StoredSkillWrites::class);
    }
}
