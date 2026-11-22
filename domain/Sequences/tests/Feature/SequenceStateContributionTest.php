<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use App\Contracts\CommandBus;
use App\Enums\RewriteSupport;
use App\Exceptions\StackAlreadyClosed;
use App\Models\AgentStackRow;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use Carbon\CarbonImmutable;
use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Commands\CancelSequence\CancelSequenceCommand;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\SequenceWork;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;

final class SequenceStateContributionTest extends TestCase
{
    use CommittedHookStack;

    private const string FIRST_STEP = 'Read the brief.';

    private const string SECOND_STEP = 'Run the phase tests.';

    public function test_starting_a_run_commits_the_start_and_its_state_together(): void
    {
        $run = $this->newRun();

        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $this->assertSame(
            [SequenceRunState::Running, 1, 'agent', TestIds::of(1)],
            [$run->fresh()?->state, $run->fresh()?->current_step, $run->fresh()?->actor_type, $run->fresh()?->actor_id],
        );

        $this->assertSame(['hooks.ready', 'sequences.following'], $this->storedTypeKeys());
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $run = $this->newRun();
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));
            $this->fail('The start went through without its push.');
        } catch (StackAlreadyClosed) {
            $this->assertNull($run->fresh()?->actor_id);
        }
    }

    public function test_each_hook_reads_the_current_step_fresh(): void
    {
        $run = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $onFirstStep = $this->answerStop('call-1');
        $this->app->make(CommandBus::class)->run(new AdvanceSequenceCommand($run->id));
        $onSecondStep = $this->answerStop('call-2');

        $this->assertStringContainsString($this->stepText($run, 1, self::FIRST_STEP), $onFirstStep);

        $this->assertStringContainsString($this->stepText($run, 2, self::SECOND_STEP), $onSecondStep);
    }

    public function test_a_compaction_repeats_the_step_without_advancing_the_run(): void
    {
        $run = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $context = json_decode($this->answerCompaction('call-1'), true, flags: JSON_THROW_ON_ERROR);

        $this->assertContains($this->stepText($run, 1, self::FIRST_STEP), $context);
        $this->assertSame(1, $run->fresh()?->current_step);
    }

    public function test_a_finished_or_cancelled_run_is_passed_over_and_a_push_pops_the_exposed_one(): void
    {
        $finished = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($finished->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new AdvanceSequenceCommand($finished->id));
        $this->app->make(CommandBus::class)->run(new AdvanceSequenceCommand($finished->id));

        $this->assertSame(SequenceRunState::Finished, $finished->fresh()?->state);
        $this->assertSame('{}', $this->answerStop('call-1'));

        $cancelled = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($cancelled->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new CancelSequenceCommand($cancelled->id));

        $this->assertSame('{}', $this->answerStop('call-2'));
        $this->assertSame(['hooks.ready', 'sequences.following'], $this->storedTypeKeys());
    }

    private function newRun(): SequenceRun
    {
        return SequenceRun::create('Close a task', [self::FIRST_STEP, self::SECOND_STEP]);
    }

    private function stepText(SequenceRun $run, int $step, string $instruction): string
    {
        return new SequenceWork($run->number, $step, $instruction, SequenceRunState::Running)->currentInstruction();
    }

    /**
     * The reply to a compaction, which carries the answer's context as JSON.
     */
    private function answerCompaction(string $callId): string
    {
        $this->callAs($callId);

        $capabilities = new DriverCapabilities(
            'Test program',
            'compaction context',
            ['onCompaction'],
            RewriteSupport::WithoutApproval,
        );

        $compaction = new ContextCompacted(
            new HookIdentity(TestIds::of(1), TestIds::of(10), $callId, self::inputDigest()),
            new CompactionDetails('compaction-1'),
        );

        $reply = $this->machine()->answer(
            $compaction,
            $capabilities,
            new OperationDeadline(3000),
            fn (HookAnswer $answer) => new DriverReply(json_encode($answer->context) ?: '[]', '', 0),
        );

        return $reply->stdout;
    }
}
