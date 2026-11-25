<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\CreateSkill\CreateSkillCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Events\Skills\SkillsChanged;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\SkillConditionInvalid;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillRequestReused;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Support\ActorContext;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillRevisionResult;
use Illuminate\Support\Facades\Event;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;
use Throwable;

/**
 * The owner creates a skill at revision one: a repeated request id returns the same result and other content under it
 * is refused, an agent is refused before any row changes, invalid keys, conditions and limits save nothing, and a save
 * says skills changed while a replay says nothing.
 */
final class CreateSkillTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

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
