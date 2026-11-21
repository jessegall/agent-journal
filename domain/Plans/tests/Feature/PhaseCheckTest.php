<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Processes\Commands\AssessPartOutput;
use Domain\Plans\Commands\RecordPhaseCheck;
use Domain\Plans\Exceptions\PhaseCheckRefused;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseCheck;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;

/**
 * A phase relies only on a current validated result receipt published after its tasks last changed; an evidence
 * run, a run without a result, a superseded receipt and a receipt from before the last task change are refused
 * (story 197, plan 14 decisions D15 and D16).
 */
final class PhaseCheckTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedCalls;

    private Phase $phase;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $plan = Plan::factory()->create(['title' => 'Checked phase']);
        $this->task = Task::factory()->create(['title' => 'Write it']);
        $this->phase = $this->planStructure()->addPhase($plan, 'Build');
        $this->planStructure()->addTasks($this->phase, [$this->task->id]);
        $this->openAcmeRequest();
        $this->approvePair();
    }

    public function test_a_valid_receipt_is_recorded_on_the_phase(): void
    {
        $receipt = $this->receiptOf(0, self::PASSED_OUTPUT);

        $this->runAsAgent(new RecordPhaseCheck($this->phase->id, $receipt));

        $check = PhaseCheck::query()->ofPhase($this->phase)->sole();
        $this->assertSame('passed', $check->outcome);
        $this->assertSame('acme verify', $check->operation);
    }

    public function test_a_run_without_a_result_and_a_superseded_receipt_are_refused(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $first = $this->runAsAgent(new AssessPartOutput($part->id));
        $this->runAsAgent(new AssessPartOutput($part->id));

        $superseded = new RecordPhaseCheck($this->phase->id, $first);
        $this->assertThrows(fn () => $this->runAsAgent($superseded), PhaseCheckRefused::class);

        $this->assertThrows(
            fn () => $this->runAsAgent(new RecordPhaseCheck($this->phase->id, 'no-receipt-for-an-evidence-run')),
            PhaseCheckRefused::class,
        );

        $this->assertSame(0, PhaseCheck::query()->count());
    }

    public function test_a_receipt_from_before_the_last_task_change_is_stale(): void
    {
        $receipt = $this->receiptOf(0, self::PASSED_OUTPUT);
        Task::query()->whereKey($this->task->id)->update(['updated_at' => now()->addMinute()]);

        $stale = new RecordPhaseCheck($this->phase->id, $receipt);
        $this->assertThrows(fn () => $this->runAsAgent($stale), PhaseCheckRefused::class);
    }

    private function receiptOf(int $status, string $output): string
    {
        return $this->runAsAgent(new AssessPartOutput($this->normalRun($status, $output)->id));
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
