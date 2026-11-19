<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\RetryProcessRun;
use App\Processes\Commands\StopSurvivors;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Enums\CaptureState;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\RetryRefused;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ResultReceipt;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PartKey;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A run whose supervisor fell silent is settled as lost, never as a success, and a user retries it as a new run
 * through a fresh admission (doc 21 revision 6, sections 53 and 70; stories 128, 129, 137, 165 and 178).
 */
final class RunReconcileTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private ProcessRun $run;

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        config(['processes.runner' => true]);
        $this->start = TestStart::start();
        $this->start->startRequest($this->app);
        $context = ExecutionContext::inFolder(base_path());
        $admissions = $this->app->make(ShellAdmission::class);
        $admission = $admissions->admit('cat composer.json', ShellDialect::Bash, $context, 'key-1');
        $this->run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($admission->runId);
        $this->run->consumeFor('test-key', (string) config('app.key'));
        $this->part = PartRun::queue($this->run, new PartKey(1, 1, 'cat'));
        $this->part->start(1, 'host');
    }

    public function test_a_silent_run_is_lost_with_no_status_and_incomplete_capture(): void
    {
        $this->silence();

        $this->artisan('process:reconcile')->expectsOutputToContain('1 runs marked lost')->assertExitCode(0);

        $part = $this->part->refresh();
        $this->assertSame(LifecycleState::Lost, $part->lifecycle);
        $this->assertSame(PartEndType::Unavailable, $part->end_type);
        $this->assertFalse($part->end()->hasStatus());
        $this->assertSame(CaptureState::Incomplete, $part->capture_state);
        $this->assertSame(LifecycleState::Lost, $this->run->refresh()->lifecycle);
        $this->assertSame(0, ResultReceipt::query()->count());
    }

    public function test_a_run_that_still_beats_is_left_alone(): void
    {
        $this->run->recordHeartbeat();

        $this->artisan('process:reconcile')->expectsOutputToContain('0 runs marked lost');

        $this->assertSame(LifecycleState::Running, $this->part->refresh()->lifecycle);
    }

    public function test_a_retry_admits_the_same_line_as_a_new_run_and_the_lost_one_stays_lost(): void
    {
        $this->silence();
        $this->artisan('process:reconcile');
        $this->setActor(TestActors::user(7));
        $bus = $this->app->make(CommandBus::class);

        $other = new RetryProcessRun($this->run->id, 'cat README.md', 'key-2');
        $this->assertThrows(fn () => $bus->run($other), RetryRefused::class);
        $retried = $bus->run(new RetryProcessRun($this->run->id, 'cat composer.json', 'key-2'));
        $bus->run(new StopSurvivors($this->run->id));

        $this->assertNotSame($this->run->id, $retried);
        $this->assertSame(LifecycleState::Lost, $this->run->refresh()->lifecycle);
        $this->assertTrue($this->run->isStale());
    }

    private function silence(): void
    {
        ProcessRun::query()
            ->withoutGlobalScopes()
            ->whereKey($this->run->id)
            ->update(['heartbeat_at' => now()->subMinutes(5)]);
    }

    private function setActor(ActorContext $actor): void
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set($actor, new OwnerAuthority('test'));
    }
}
