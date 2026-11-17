<?php

declare(strict_types=1);

namespace Tests\Feature\Sequences;

use App\Domain\Hooks\Inputs\CompactionDetails;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\Models\StackAlreadyClosed;
use App\Domain\Hooks\OperationDeadline;
use App\Domain\Hooks\Programs\ProgramCapabilities;
use App\Domain\Hooks\Programs\ProgramReplies;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\Programs\RewriteSupport;
use App\Domain\Hooks\Stack\HookAnswer;
use App\Domain\Sequences\Models\SequenceRun;
use App\Domain\Sequences\SequenceRunState;
use App\Domain\Sequences\StartSequence;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class SequenceStateContributionTest extends TestCase
{
    use CommittedHookStack;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('sequence_runs')->truncate();
        $this->launchCommittedStack(withTestStateTypes: false);
    }

    protected function tearDown(): void
    {
        DB::table('sequence_runs')->truncate();
        $this->emptyHookTables();

        parent::tearDown();
    }

    public function test_starting_a_run_commits_the_start_and_its_state_together(): void
    {
        $run = $this->newRun();

        $this->app->make(StartSequence::class)->start($run, $this->target);

        $this->assertSame([SequenceRunState::Running, 1, 1, 10], [$run->fresh()?->state, $run->fresh()?->current_step, $run->fresh()?->agent_id, $run->fresh()?->session_id]);
        $this->assertSame(['hooks.main_ready', 'sequences.following'], $this->storedTypeKeys());
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $run = $this->newRun();
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(StartSequence::class)->start($run, $this->target);
            $this->fail('The start went through without its push.');
        } catch (StackAlreadyClosed) {
            $this->assertNull($run->fresh()?->agent_id);
        }
    }

    public function test_each_hook_reads_the_current_step_fresh(): void
    {
        $run = $this->newRun();
        $this->app->make(StartSequence::class)->start($run, $this->target);

        $onFirstStep = $this->answerStop('call-1');
        $run->advance();
        $onSecondStep = $this->answerStop('call-2');

        $this->assertStringContainsString("Sequence run {$run->id} is on step 1: Read the brief.", $onFirstStep);
        $this->assertStringContainsString("Sequence run {$run->id} is on step 2: Run the phase tests.", $onSecondStep);
    }

    public function test_a_compaction_repeats_the_step_without_advancing_the_run(): void
    {
        $run = $this->newRun();
        $this->app->make(StartSequence::class)->start($run, $this->target);

        $context = $this->answerCompaction('call-1');

        $this->assertSame(["Sequence run {$run->id} is on step 1: Read the brief."], $context);
        $this->assertSame(1, $run->fresh()?->current_step);
    }

    public function test_a_finished_or_cancelled_run_leaves_on_the_next_hook(): void
    {
        $finished = $this->newRun();
        $this->app->make(StartSequence::class)->start($finished, $this->target);
        $finished->advance();
        $finished->advance();

        $this->assertSame(SequenceRunState::Finished, $finished->fresh()?->state);
        $this->assertSame('{}', $this->answerStop('call-1'));

        $cancelled = $this->newRun();
        $this->app->make(StartSequence::class)->start($cancelled, $this->target);
        $cancelled->cancel();

        $this->assertSame('{}', $this->answerStop('call-2'));
        $this->assertSame(['hooks.main_ready'], $this->storedTypeKeys());
    }

    private function newRun(): SequenceRun
    {
        return SequenceRun::query()->create(['name' => 'Close a task', 'steps' => ['Read the brief.', 'Run the phase tests.']]);
    }

    private function answerStop(string $callId): string
    {
        $this->callAs($callId);

        return $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), fn (HookAnswer $answer) => ProgramReplies::stop($answer))->stdout;
    }

    /**
     * @return list<string>
     */
    private function answerCompaction(string $callId): array
    {
        $this->callAs($callId);
        $capabilities = new ProgramCapabilities('Test program', 'compaction context', ['onCompaction'], RewriteSupport::WithoutApproval);
        $compaction = new ContextCompacted(new HookIdentity(1, 10, $callId, self::inputDigest()), new CompactionDetails(2));

        $reply = $this->machine()->answer($compaction, $capabilities, new OperationDeadline(3000), fn (HookAnswer $answer) => new ProgramReply(json_encode($answer->context) ?: '[]', '', 0));

        return json_decode($reply->stdout, true);
    }
}
