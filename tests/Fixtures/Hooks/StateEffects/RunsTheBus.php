<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Bus\Contracts\CommandBus as Runner;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Records\Commands\UnlinkRecords;
use App\Records\Support\RecordIdentity;

/**
 * A state that runs a command itself through an aliased import, which the state effects check refuses.
 */
final class RunsTheBus extends AgentState
{
    public function __construct(private readonly Runner $runner) {}

    public function onStop(StopRequested $input): null
    {
        $command = new UnlinkRecords(new RecordIdentity('tasks.task', '1'), new RecordIdentity('tasks.task', '2'));

        $this->runner->run($command);

        return null;
    }
}
