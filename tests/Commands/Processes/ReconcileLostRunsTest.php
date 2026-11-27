<?php

declare(strict_types=1);

namespace Tests\Commands\Processes;

use App\Access\Contracts\ShellAdmission;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ResultReceipt;
use App\Processes\Commands\ReconcileLostRuns\ReconcileLostRunsCommand;
use App\Processes\Enums\CaptureStatus;
use App\Processes\Enums\LifecycleStatus;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\PartKey;
use App\Values\ExecutionContext;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A silent run is lost with no status and incomplete capture, and a run that still beats is left alone.
 */
#[TestsCommand(ReconcileLostRunsCommand::class)]
final class ReconcileLostRunsTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private ProcessRun $run;

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->start = $this->journal->signedStart('Test agent');
        $this->start->startRequest($this->app);
        $context = ExecutionContext::inFolder(base_path());
        $admissions = $this->app->make(ShellAdmission::class);
        $admission = $admissions->admit('cat composer.json', ShellDialect::Bash, $context, 'key-1');
        $this->run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($admission->runId);
        $this->run->consumeFor('test-key', (string) config('app.key'));
        $this->part = PartRun::create($this->run, new PartKey(1, 1, 'cat'));
        $this->part->start('host', 1);
    }

    public function test_a_silent_run_is_lost_with_no_status_and_incomplete_capture(): void
    {
        $this->silence();

        $this->artisan('process:reconcile')->expectsOutputToContain('1 runs marked lost')->assertExitCode(0);

        $part = $this->part->refresh();
        $this->assertSame(LifecycleStatus::Lost, $part->lifecycle);
        $this->assertSame(PartEndType::Unavailable, $part->end_type);
        $this->assertFalse($part->end->hasStatus());
        $this->assertSame(CaptureStatus::Incomplete, $part->capture_state);
        $this->assertSame(LifecycleStatus::Lost, $this->run->refresh()->lifecycle);
        $this->assertSame(0, ResultReceipt::query()->count());
    }

    public function test_a_run_that_still_beats_is_left_alone(): void
    {
        $this->run->recordHeartbeat();

        $this->artisan('process:reconcile')->expectsOutputToContain('0 runs marked lost');

        $this->assertSame(LifecycleStatus::Running, $this->part->refresh()->lifecycle);
    }

    private function silence(): void
    {
        ProcessRun::query()
            ->withoutGlobalScopes()
            ->whereKey($this->run->id)
            ->update(['heartbeat_at' => now()->subMinutes(5)]);
    }
}
