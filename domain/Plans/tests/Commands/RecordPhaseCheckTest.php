<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Commands\Runs\AssessPartOutput\AssessPartOutputCommand;
use Domain\Plans\Commands\RecordPhaseCheck\RecordPhaseCheckCommand;
use Domain\Plans\Exceptions\PhaseCheckRefused;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseCheck;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;

/**
 * A phase relies only on a current validated result receipt published after its tasks last changed; an evidence
 * run, a run without a result, a superseded receipt and a receipt from before the last task change are refused.
 */
#[TestsCommand(RecordPhaseCheckCommand::class)]
final class RecordPhaseCheckTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    private const string OPERATION = 'acme verify';

    private Phase $phase;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->task = $this->journal->fixtures(TaskFixtures::class)->task('Write it')->taskCalled('Write it');

        $this->phase = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Checked phase')
            ->phaseWithTask('Checked phase', 'Build', $this->task->assignmentIdentity())
            ->phaseCalled('Build');

        $this->openAcmeRequest();
        $this->approvePair();
    }

    public function test_a_valid_receipt_is_recorded_on_the_phase(): void
    {
        $receipt = $this->receiptOf(0, self::PASSED_OUTPUT);

        $this->journal->runAsStart(
            $this->start,
            new RecordPhaseCheckCommand($this->phase->id, $receipt),
        );

        $check = PhaseCheck::query()->ofPhase($this->phase)->sole();
        $this->assertSame('passed', $check->outcome);
        $this->assertSame(self::OPERATION, $check->operation);
    }

    public function test_a_run_without_a_result_and_a_superseded_receipt_are_refused(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);

        $first = $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new AssessPartOutputCommand($part->id));

        $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new AssessPartOutputCommand($part->id));

        $superseded = new RecordPhaseCheckCommand($this->phase->id, $first);

        $this->assertThrows(
            fn () => $this->journal->runAsStart($this->start, $superseded),
            PhaseCheckRefused::class,
        );

        $this->assertThrows(
            fn () => $this->journal->runAsStart(
                $this->start,
                new RecordPhaseCheckCommand($this->phase->id, 'no-receipt-for-an-evidence-run'),
            ),
            PhaseCheckRefused::class,
        );

        $this->assertSame(0, PhaseCheck::query()->count());
    }

    public function test_a_receipt_from_before_the_last_task_change_is_stale(): void
    {
        $receipt = $this->receiptOf(0, self::PASSED_OUTPUT);
        Task::query()->whereKey($this->task->id)->update(['updated_at' => now()->addMinute()]);

        $stale = new RecordPhaseCheckCommand($this->phase->id, $receipt);

        $this->assertThrows(
            fn () => $this->journal->runAsStart($this->start, $stale),
            PhaseCheckRefused::class,
        );
    }

    private function receiptOf(int $status, string $output): string
    {
        return $this->journal->runAsStart(
            $this->start,
            new AssessPartOutputCommand($this->normalRun($status, $output)->id),
        );
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
