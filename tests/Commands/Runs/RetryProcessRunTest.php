<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\RetryProcessRun\RetryProcessRunCommand;
use App\Commands\Runs\StopLeftoverProcesses\StopLeftoverProcessesCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Bus\CommandBus;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\LifecycleStatus;
use App\Exceptions\RetryRefused;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\ExecutionContext;
use App\Values\OwnerAuthority;
use App\Values\PartKey;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A retry admits the same line as a new run, and the lost one stays lost.
 */
#[TestsCommand(RetryProcessRunCommand::class)]
final class RetryProcessRunTest extends TestCase
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

    public function test_a_retry_admits_the_same_line_as_a_new_run_and_the_lost_one_stays_lost(): void
    {
        $this->silence();
        $this->artisan('process:reconcile');
        $this->setActor(TestActors::user(7));
        $bus = $this->app->make(CommandBus::class);

        $other = new RetryProcessRunCommand($this->run->id, 'cat README.md', 'key-2');
        $this->assertThrows(fn () => $bus->run($other), RetryRefused::class);
        $retried = $bus->run(new RetryProcessRunCommand($this->run->id, 'cat composer.json', 'key-2'));
        $bus->run(new StopLeftoverProcessesCommand($this->run->id));

        $this->assertNotSame($this->run->id, $retried);
        $this->assertSame(LifecycleStatus::Lost, $this->run->refresh()->lifecycle);
        $this->assertTrue($this->run->isStale());
    }

    private function silence(): void
    {
        ProcessRun::query()
            ->withoutGlobalScopes()
            ->whereKey($this->run->id)
            ->update(['heartbeat_at' => now()->subMinutes(5)]);
    }

    private function setActor(ActorIdentity $actor): void
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set($actor, new OwnerAuthority('test'));
    }
}
