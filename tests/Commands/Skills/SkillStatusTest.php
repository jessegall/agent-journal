<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Events\Sessions\SessionOpened;
use App\Exceptions\SkillSessionHidden;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillReadEntry;
use App\Resolvers\Support\SkillStatusResolver;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Values\SessionSkillStatus;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * skill:status shows each session's generation and handed keys, and for one session every skill with its selection and
 * whether it changed since the start; an agent sees only its own session.
 */
final class SkillStatusTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'process_runs',
        'part_runs',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->agent('Reader');
        $this->journal->refreshSkills();
    }

    public function test_a_session_handed_skills_shows_its_generation_keys_and_skills_unchanged(): void
    {
        $session = $this->admitted('Writer');

        $skills = $this->skillsOf($session);

        $handed = fn (SessionSkillStatus $skill) => $skill->handedGeneration === $session->skill_generation_id;
        $this->assertSame($session->skill_keys, $this->keysOf($skills, $handed));
        $this->assertSame([], $this->keysOf($skills, fn (SessionSkillStatus $skill) => $skill->hasChanged));

        $this->artisan('skill:status', ['--session' => $session->id])
            ->expectsOutputToContain($session->skill_generation_id)
            ->assertSuccessful();
    }

    public function test_a_skill_made_after_the_start_is_marked_as_changed(): void
    {
        $session = $this->admitted('Writer');
        $this->journal->skill('user-review-notes', new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', 'Read the diff first.')],
            '',
        ));
        $this->journal->refreshSkills();

        $skills = $this->skillsOf($session);

        $this->assertSame(['user-review-notes'], $this->keysOf($skills, fn (SessionSkillStatus $s) => $s->hasChanged));
        $this->assertSame([], $this->keysOf(
            $skills,
            fn (SessionSkillStatus $s) => $s->key === 'user-review-notes' && $s->handedGeneration !== null,
        ));
    }

    public function test_a_key_read_in_the_session_shows_its_last_read_and_an_unread_key_shows_none(): void
    {
        $session = $this->admitted('Writer');
        $key = $session->skill_keys[0];
        SkillReadEntry::record($session, $key, ReadEvidence::FullFileRead);
        SkillReadEntry::record($session, $key, ReadEvidence::SkillShow);

        $skills = $this->skillsOf($session);

        $read = array_values(array_filter($skills, fn (SessionSkillStatus $skill) => $skill->key === $key))[0];
        $this->assertSame(ReadEvidence::SkillShow, $read->lastRead?->evidence);
        $this->assertSame([$key], $this->keysOf($skills, fn (SessionSkillStatus $skill) => $skill->lastRead !== null));

        $this->artisan('skill:status', ['--session' => $session->id])
            ->expectsOutputToContain('skill-show at')
            ->assertSuccessful();
    }

    public function test_an_agent_sees_its_own_session_and_no_other(): void
    {
        $own = $this->admitted('Writer');
        $other = $this->admitted('Reader');

        $this->journal->actAs('Writer');
        $resolver = $this->app->make(SkillStatusResolver::class);

        $this->assertNotSame([], $resolver->skillsOfSession($own->id));
        $this->expectException(SkillSessionHidden::class);

        $resolver->skillsOfSession($other->id);
    }

    private function admitted(string $agent): AgentSession
    {
        $session = $this->journal->sessionOf($agent);
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($session->agent_id, $session->id));

        return AgentSession::findById($session->id);
    }

    /**
     * @param  list<SessionSkillStatus>  $skills
     * @param  callable(SessionSkillStatus): bool  $matches
     * @return list<string>
     */
    private function keysOf(array $skills, callable $matches): array
    {
        return array_values(array_map(
            fn (SessionSkillStatus $skill) => $skill->key,
            array_filter($skills, $matches),
        ));
    }

    /**
     * @return list<SessionSkillStatus>
     */
    private function skillsOf(AgentSession $session): array
    {
        $this->app->forgetScopedInstances();

        return $this->app->make(SkillStatusResolver::class)->skillsOfSession($session->id);
    }
}
