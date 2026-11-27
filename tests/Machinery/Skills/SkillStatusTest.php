<?php

declare(strict_types=1);

namespace Tests\Machinery\Skills;

use App\Exceptions\SkillSessionHidden;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillReadEntry;
use App\Resolvers\Support\SkillStatusResolver;
use App\Skills\Commands\AskSkillRead\AskSkillReadCommand;
use App\Skills\Enums\ReadEvidence;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Values\SessionSkillStatus;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Agents\TestSession;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * skill:status shows each session's generation and handed keys, and for one session every skill with its selection and
 * whether it changed since the start; an agent sees only its own session.
 */
#[TestsMachinery(SkillStatusResolver::class)]
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
        'skill_reads',
        'agent_stacks',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->agent('Reader');
        $this->journal->refreshSkills();
        $this->journal->actAs('Owner');
    }

    public function test_a_session_handed_skills_shows_its_generation_keys_and_skills_unchanged(): void
    {
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session->handSkills()));
        $session = AgentSession::findById($this->journal->sessionOf('Writer')->id);

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
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session->handSkills()));
        $session = AgentSession::findById($this->journal->sessionOf('Writer')->id);
        $this->journal->skill('user-review-notes', new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', 'Read the diff first.')],
            '',
        ));
        $this->journal->refreshSkills()->actAs('Owner');

        $skills = $this->skillsOf($session);

        $this->assertSame(['user-review-notes'], $this->keysOf($skills, fn (SessionSkillStatus $s) => $s->hasChanged));
        $this->assertSame([], $this->keysOf(
            $skills,
            fn (SessionSkillStatus $s) => $s->key === 'user-review-notes' && $s->handedGeneration !== null,
        ));
    }

    public function test_a_key_read_in_the_session_shows_its_last_read_and_an_unread_key_shows_none(): void
    {
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session->handSkills()));
        $session = AgentSession::findById($this->journal->sessionOf('Writer')->id);
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

    public function test_a_key_still_to_read_shows_so_and_a_read_key_does_not(): void
    {
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session->handSkills()));
        $session = AgentSession::findById($this->journal->sessionOf('Writer')->id);
        [$first, $second] = $session->skill_keys;
        $this->journal->actAsAgentIds($session->agent_id, $session->id);
        $this->journal->runUnkeyed(new AskSkillReadCommand($session->id, [$first, $second]));
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session
                ->finishToolCall('Bash', ['command' => "php artisan skill:show {$first}"])));
        $this->journal->actAs('Owner');

        $skills = $this->skillsOf($session);

        $this->assertSame([$second], $this->keysOf($skills, fn (SessionSkillStatus $skill) => $skill->isStillToRead));
    }

    public function test_an_agent_sees_its_own_session_and_no_other(): void
    {
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session->handSkills()));
        $own = AgentSession::findById($this->journal->sessionOf('Writer')->id);
        $this->journal->withAgent('Reader', fn (TestAgent $reader) => $reader
            ->session(fn (TestSession $session) => $session->handSkills()));
        $other = AgentSession::findById($this->journal->sessionOf('Reader')->id);

        $this->journal->actAs('Writer');
        $resolver = $this->app->make(SkillStatusResolver::class);

        $this->assertNotSame([], $resolver->skillsOfSession($own->id));
        $this->expectException(SkillSessionHidden::class);

        $resolver->skillsOfSession($other->id);
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
        return $this->app->make(SkillStatusResolver::class)->skillsOfSession($session->id);
    }
}
