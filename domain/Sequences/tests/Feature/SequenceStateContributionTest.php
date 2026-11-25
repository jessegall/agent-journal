<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\RewriteSupport;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\StateLoading\StateBuilder;
use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Commands\CancelSequence\CancelSequenceCommand;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\States\FollowSequenceState;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;
use Tests\Support\TestText;

final class SequenceStateContributionTest extends TestCase
{
    use CommittedHookStack;

    private const string FIRST_STEP = 'Read the brief.';

    private const string SECOND_STEP = 'Run the phase tests.';

    public function test_each_hook_reads_the_current_step_fresh(): void
    {
        $run = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $onFirstStep = $this->answerStop('call-1');
        $this->app->make(CommandBus::class)->run(new AdvanceSequenceCommand($run->id));
        $onSecondStep = $this->answerStop('call-2');

        $this->assertStringContainsString($this->stepText($run, 1), $onFirstStep);

        $this->assertStringContainsString($this->stepText($run, 2), $onSecondStep);
    }

    public function test_a_compaction_repeats_the_step_without_advancing_the_run(): void
    {
        $run = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($run->id, $this->target->sessionId));

        $context = json_decode($this->answerCompaction('call-1'), true, flags: JSON_THROW_ON_ERROR);

        $this->assertContains($this->stepText($run, 1), $context);
        $this->assertSame(1, $run->fresh()?->current_step);
    }

    public function test_a_finished_or_cancelled_run_is_passed_over_and_a_push_pops_the_exposed_one(): void
    {
        $finished = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($finished->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new AdvanceSequenceCommand($finished->id));
        $this->app->make(CommandBus::class)->run(new AdvanceSequenceCommand($finished->id));

        $this->assertSame(SequenceRunStatus::Finished, $finished->fresh()?->status);
        $this->assertSame('{}', $this->answerStop('call-1'));

        $cancelled = $this->newRun();
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($cancelled->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new CancelSequenceCommand($cancelled->id));

        $this->assertSame('{}', $this->answerStop('call-2'));
        $this->assertSame([
            'core.ready',
            'sequences.follow',
        ], $this->storedTypeKeys());
    }

    private function newRun(): SequenceRun
    {
        return SequenceRun::create('Close a task', [
            self::FIRST_STEP,
            self::SECOND_STEP,
        ]);
    }

    private function stepText(SequenceRun $run, int $step): string
    {
        $values = ['runId' => $run->id, 'runNumber' => $run->number, 'steps' => $run->steps, 'currentStep' => $step];

        return TestText::words($this->app->make(StateBuilder::class)
            ->build(RegisteredStateType::of(FollowSequenceState::class), $values)
            ->instruction()
            ->get());
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
