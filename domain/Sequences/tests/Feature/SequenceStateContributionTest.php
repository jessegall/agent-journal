<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\StackAlreadyClosed;
use App\Hooks\Inputs\CompactionDetails;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Stack\HookAnswer;
use Carbon\CarbonImmutable;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;

final class SequenceStateContributionTest extends TestCase
{
    use CommittedHookStack;

    public function test_starting_a_run_commits_the_start_and_its_state_together(): void
    {
        $run = $this->newRun();

        $this->app->make(CommandBus::class)->run(new StartSequence($run->id, $this->target->sessionId));

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
            $this->app->make(CommandBus::class)->run(new StartSequence($run->id, $this->target->sessionId));
            $this->fail('The start went through without its push.');
        } catch (StackAlreadyClosed) {
            $this->assertNull($run->fresh()?->actor_id);
        }
    }

    public function test_each_hook_reads_the_current_step_fresh(): void
    {
        $run = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequence($run->id, $this->target->sessionId));

        $onFirstStep = $this->answerStop('call-1');
        $run->advance();
        $onSecondStep = $this->answerStop('call-2');

        $this->assertStringContainsString("Sequence run {$run->number} is on step 1: Read the brief.", $onFirstStep);
        $this->assertStringContainsString(
            "Sequence run {$run->number} is on step 2: Run the phase tests.",
            $onSecondStep,
        );
    }

    public function test_a_compaction_repeats_the_step_without_advancing_the_run(): void
    {
        $run = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequence($run->id, $this->target->sessionId));

        $context = json_decode($this->answerCompaction('call-1'), true, flags: JSON_THROW_ON_ERROR);

        $this->assertContains("Sequence run {$run->number} is on step 1: Read the brief.", $context);
        $this->assertSame(1, $run->fresh()?->current_step);
    }

    public function test_a_finished_or_cancelled_run_is_passed_over_and_a_push_pops_the_exposed_one(): void
    {
        $finished = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequence($finished->id, $this->target->sessionId));
        $finished->advance();
        $finished->advance();

        $this->assertSame(SequenceRunState::Finished, $finished->fresh()?->state);
        $this->assertSame('{}', $this->answerStop('call-1'));

        $cancelled = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequence($cancelled->id, $this->target->sessionId));
        $cancelled->cancel();

        $this->assertSame('{}', $this->answerStop('call-2'));
        $this->assertSame(['hooks.ready', 'sequences.following'], $this->storedTypeKeys());
    }

    private function newRun(): SequenceRun
    {
        return SequenceRun::written('Close a task', ['Read the brief.', 'Run the phase tests.']);
    }

    /**
     * The reply to a compaction, which carries the answer's context as JSON.
     */
    private function answerCompaction(string $callId): string
    {
        $this->callAs($callId);
        $capabilities = new ProgramCapabilities(
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
            fn (HookAnswer $answer) => new ProgramReply(json_encode($answer->context) ?: '[]', '', 0),
        );

        return $reply->stdout;
    }
}
