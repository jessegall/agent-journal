<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\CreateSkill\CreateSkillCommand;
use App\Skills\Commands\RestoreSkill\RestoreSkillCommand;
use App\Skills\Commands\ReviseSkill\ReviseSkillCommand;
use App\Skills\Events\SkillsChanged;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillRequestReused;
use App\Skills\Exceptions\SkillRevisionConflict;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillRevision;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;
use Illuminate\Support\Facades\Event;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;
use Throwable;

/**
 * Users create, revise and restore stored skills through the bus: revisions append against the revision read, a
 * request id answers once, and an agent or invalid content changes nothing.
 */
final class StoredSkillCommandsTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

    private const string REVISION_CONFLICT = 'is at revision 2 now';

    private const string RESERVED_PREFIX = 'whose prefix it does not own';

    private const string NO_SECTIONS = 'has 0 sections';

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
    ];

    public function test_create_gives_revision_1_and_revise_gives_2_keeping_1_readable(): void
    {
        $created = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $revised = $this->runCommand(new ReviseSkillCommand($created->skillId, 1, 'revise-1', $this->draft('Second.')));

        $this->assertSame(1, $created->revision);
        $this->assertSame(2, $revised->revision);
        $this->assertTrue($revised->publicationPending);
        $this->assertSame(
            'First.',
            SkillRevision::numbered(
                Skill::query()->whereKey($created->skillId)->firstOrFail(),
                1,
            )->sections[0]->content,
        );
    }

    public function test_a_revise_against_an_old_revision_is_refused_naming_the_latest(): void
    {
        $created = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $this->runCommand(new ReviseSkillCommand($created->skillId, 1, 'revise-1', $this->draft('Second.')));

        $this->assertRefused(
            SkillRevisionConflict::class,
            new ReviseSkillCommand($created->skillId, 1, 'revise-2', $this->draft('Third.')),
            self::REVISION_CONFLICT,
        );
    }

    public function test_a_repeated_request_id_returns_the_same_result_and_other_content_under_it_is_refused(): void
    {
        $first = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $again = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));

        $this->assertEquals($first, $again);
        $this->assertSame(1, Skill::query()->count());
        $this->assertSame(1, SkillRevision::query()->count());
        $this->assertRefused(
            SkillRequestReused::class,
            new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('Other.')),
            SkillRequestReused::for('create-1')->getMessage(),
        );
    }

    public function test_restore_appends_the_old_content_as_a_new_revision(): void
    {
        $created = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $this->runCommand(new ReviseSkillCommand($created->skillId, 1, 'revise-1', $this->draft('Second.')));
        $restored = $this->runCommand(new RestoreSkillCommand($created->skillId, 1, 2, 'restore-1'));
        $skill = Skill::query()->whereKey($created->skillId)->firstOrFail();

        $this->assertSame(3, $restored->revision);
        $this->assertSame('First.', SkillRevision::currentOf($skill)->sections[0]->content);
        $this->assertSame('Second.', SkillRevision::numbered($skill, 2)->sections[0]->content);
    }

    public function test_an_agent_is_refused_before_any_row_changes(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(3)),
            TestStartAuthority::forAgent(TestIds::of(3)),
        );

        $this->assertRefused(
            ActorNotAllowed::class,
            new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')),
        );
        $this->assertSame(0, Skill::query()->count());
    }

    public function test_invalid_keys_conditions_and_limits_save_nothing(): void
    {
        $this->assertRefused(
            SkillDeclarationInvalid::class,
            new CreateSkillCommand('journal-mine', 'create-1', $this->draft('First.')),
            self::RESERVED_PREFIX,
        );
        $this->assertRefused(
            SkillConditionInvalid::class,
            new CreateSkillCommand(
                'user-notes',
                'create-2',
                new SkillDraft(
                    'Notes',
                    'Read.',
                    [new SectionDraft('a', 'A', 'Text.')],
                    '{"type":"any","version":1,"children":[]}',
                ),
            ),
            'condition.children',
        );
        $this->assertRefused(
            SkillDeclarationInvalid::class,
            new CreateSkillCommand('user-notes', 'create-3', new SkillDraft('Notes', 'Read.', [], '')),
            self::NO_SECTIONS,
        );
        $this->assertSame(0, Skill::query()->count());
    }

    public function test_a_save_raises_skills_changed_and_a_replay_raises_none(): void
    {
        Event::fake([SkillsChanged::class]);

        $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));

        Event::assertDispatchedTimes(SkillsChanged::class, 1);
    }

    private function draft(string $text): SkillDraft
    {
        return new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', $text)],
            '',
        );
    }

    /**
     * @param  Command<SkillRevisionResult>  $command
     */
    private function runCommand(Command $command): SkillRevisionResult
    {
        return $this->app->make(CommandBus::class)->run($command);
    }

    /**
     * @param  class-string<Throwable>  $refusal
     * @param  Command<SkillRevisionResult>  $command
     */
    private function assertRefused(string $refusal, Command $command, string $message = ''): void
    {
        try {
            $this->runCommand($command);
        } catch (Throwable $failure) {
            $this->assertInstanceOf($refusal, $failure);
            $this->assertStringContainsString($message, $failure->getMessage());

            return;
        }

        $this->fail("{$refusal} was not thrown.");
    }
}
