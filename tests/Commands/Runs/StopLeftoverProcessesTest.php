<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\StopLeftoverProcesses\StopLeftoverProcessesCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\PartKey;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user stops what a lost run left running, which marks the run stale; a run that is not lost has nothing to stop
 * and is refused.
 */
#[TestsCommand(StopLeftoverProcessesCommand::class)]
final class StopLeftoverProcessesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_running_run_is_refused_and_a_lost_one_goes_stale(): void
    {
        $run = $this->journal->owner()->agent('Runner')->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');
        $this->journal->actAs('Owner');
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new StopLeftoverProcessesCommand($run->id)));
        $this->assertFalse($run->refresh()->isStale());

        $run->markLost();
        $bus->run(new StopLeftoverProcessesCommand($run->id));

        $this->assertTrue($run->refresh()->isStale());
    }
}
