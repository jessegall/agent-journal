<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\CreateSkill\CreateSkillCommand;
use App\Commands\Skills\ReviseSkill\ReviseSkillCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\SkillRevisionConflict;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillRevisionResult;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;
use Throwable;

/**
 * A revise gives the next revision and keeps the first readable; a revise against an old revision is refused naming
 * the latest.
 */
#[TestsCommand(ReviseSkillCommand::class)]
final class ReviseSkillTest extends TestCase
{
    use CommitsHookRows;

    private const string REVISION_CONFLICT = 'is at revision 2 now';

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
    }

    public function test_create_gives_revision_1_and_revise_gives_2_keeping_1_readable(): void
    {
        $created = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $revised = $this->runCommand(new ReviseSkillCommand($created->skillId, 1, 'revise-1', $this->draft('Second.')));

        $this->assertSame(1, $created->revision);
        $this->assertSame(2, $revised->revision);
        $this->assertTrue($revised->isPublicationPending);
        $this->assertSame(
            'First.',
            SkillRevision::findNumbered(
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

    public function test_an_agent_edit_is_hidden_and_the_bus_refuses_the_same_write(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->caller = TestStart::start();

        $this->journal->actAsUserId(TestIds::of(7));
        $created = $this->app->make(CommandBus::class)->run(
            new CreateSkillCommand(
                'user-review-notes',
                'create-1',
                new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], ''),
            ),
        );

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->caller->agent->id),
            TestStartAuthority::forAgent($this->caller->agent->id),
        );

        try {
            $this->app->make(CommandBus::class)->run(
                new ReviseSkillCommand(
                    $created->skillId,
                    1,
                    'revise-1',
                    new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Other.')], ''),
                ),
            );
            $this->fail('The bus let an agent revise a skill.');
        } catch (ActorNotAllowed $refusal) {
            $this->assertNotEmpty($refusal->getMessage());
        }

        $this->journal->mcpRequest($this->caller, 'tools/call', [
            'name' => 'skills_edit',
            'arguments' => ['skill' => 'user-review-notes', 'expected_revision' => 1, 'body' => 'Other.'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);

        $this->assertSame(1, SkillRevision::query()->count());
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
