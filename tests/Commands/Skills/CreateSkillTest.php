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
use App\Policies\AssignmentRecipientPolicy;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use App\Support\DomainRegistry;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillRevisionResult;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;
use Throwable;

/**
 * The owner creates a skill at revision one: a repeated request id returns the same result and other content under it
 * is refused, an agent is refused before any row changes, invalid keys, conditions and limits save nothing, and a save
 * says skills changed while a replay says nothing.
 */
#[TestsCommand(CreateSkillCommand::class)]
final class CreateSkillTest extends TestCase
{
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

    private const string DISPATCH = AssignmentRecipientPolicy::class.':delegate';

    private const string NOTES_TEXT = 'Read the notes first.';

    private const string REVIEWERS = '{"type":"profiles","version":1,"keys":["journal-reviewer"]}';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
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

    public function test_an_agent_is_refused_before_any_row_changes(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent(TestIds::of(3)),
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

    public function test_make_edit_preview_and_restore_run_end_to_end(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));

        $this->artisan(
            'skill:make',
            [
                'key' => 'user-review-notes',
                '--description' => 'Review project notes',
                '--conditions' => self::REVIEWERS,
                '--body' => <<<'TEXT'
                ## Notes

                Read the notes first.
                TEXT,
            ],
        )
            ->expectsOutputToContain('Request id: ')
            ->expectsOutputToContain('revision 1 saved; publication pending.')
            ->expectsOutputToContain('Delivery: not yet delivered to any agent')
            ->assertSuccessful();
        $number = (string) Skill::query()->where('key', 'user-review-notes')->firstOrFail()->number;

        $this->artisan(
            'skill:edit',
            ['number' => $number, '--expected-revision' => 1, '--body' => <<<'TEXT'
            ## Notes

            Read the notes twice.
            TEXT],
        )
            ->expectsOutputToContain('revision 2 saved; publication pending.')
            ->assertSuccessful();
        $this->artisan(
            'skill:preview',
            ['key' => 'user-review-notes'],
        )->expectsOutputToContain('agents whose condition matches')->assertSuccessful();
        $this->artisan('skill:restore', ['number' => $number, '--revision' => 1, '--expected-revision' => 2])
            ->expectsOutputToContain('revision 3 saved; publication pending.')
            ->assertSuccessful();

        Artisan::call('skill:revision', ['number' => $number, 'revision' => 3]);
        $revision = Artisan::output();
        $this->assertStringContainsString(self::NOTES_TEXT, $revision);
        $this->assertStringContainsString('"keys":["journal-reviewer"]', $revision);
    }

    public function test_conditions_and_audience_flags_are_not_mixed_and_flags_compile_to_one_all_group(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));

        $this->artisan(
            'skill:make',
            [
                'key' => 'user-mixed',
                '--description' => 'Mixed',
                '--body' => 'Text.',
                '--conditions' => self::REVIEWERS,
                '--ability' => [self::DISPATCH],
            ],
        )
            ->expectsOutputToContain('cannot be mixed with audience flags')
            ->assertFailed();

        $this->artisan(
            'skill:make',
            [
                'key' => 'user-codex-main',
                '--description' => 'Codex main',
                '--body' => 'Text.',
                '--ability' => [self::DISPATCH],
                '--driver' => ['codex'],
            ],
        )->assertSuccessful();

        Artisan::call('skill:revision', ['number' => 'user-codex-main', 'revision' => 1]);
        preg_match('/^Condition: (.+)$/m', Artisan::output(), $condition);
        $this->assertEquals(['type' => 'all', 'version' => 1, 'children' => [
            ['type' => 'drivers', 'version' => 1, 'keys' => ['codex']],
            ['type' => 'abilities', 'version' => 1, 'keys' => [self::DISPATCH]],
        ]], json_decode($condition[1], true, flags: JSON_THROW_ON_ERROR));
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

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }
}
