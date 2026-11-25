<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\StopProcessRun\StopProcessRunCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Runs\LifecycleStatus;
use App\Exceptions\StopRefused;
use App\Values\PartKey;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The agent that started a run stops it with a reason, which leaves it stopped and stale; a run that already ended
 * is refused.
 */
final class StopProcessRunTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_run_is_stopped_with_its_reason_once(): void
    {
        $run = $this->journal->owner()->agent('Runner')->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');
        $bus = $this->app->make(CommandBus::class);

        $bus->run(new StopProcessRunCommand($run->id, 'not needed'));

        $run->refresh();
        $this->assertSame([LifecycleStatus::Stopped, 'not needed', true], [$run->lifecycle, $run->stop_reason, $run->isStale()]);
        $this->assertThrows(fn () => $bus->run(new StopProcessRunCommand($run->id, 'again')), StopRefused::class);
    }
}
