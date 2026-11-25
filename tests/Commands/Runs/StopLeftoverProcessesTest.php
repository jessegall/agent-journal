<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\StopLeftoverProcesses\StopLeftoverProcessesCommand;
use App\Contracts\Bus\CommandBus;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Runs\AdmitsShellRuns;
use Tests\TestCase;

/**
 * A user stops what a lost run left running, which marks the run stale; a run that is not lost has nothing to stop
 * and is refused.
 */
final class StopLeftoverProcessesTest extends TestCase
{
    use AdmitsShellRuns;
    use RefreshHookDatabase;

    public function test_a_running_run_is_refused_and_a_lost_one_goes_stale(): void
    {
        $run = $this->runningRun();
        $this->journal->owner();
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new StopLeftoverProcessesCommand($run->id)));
        $this->assertFalse($run->refresh()->isStale());

        $run->markLost();
        $bus->run(new StopLeftoverProcessesCommand($run->id));

        $this->assertTrue($run->refresh()->isStale());
    }
}
