<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Contracts\Bus\CommandBus as Runner;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Support\RecordIdentity;

/**
 * A state that runs a command itself through an aliased import, which the state effects check refuses.
 */
final class RunsTheBus extends AgentState
{
    public function __construct(private readonly Runner $runner) {}

    public function onStop(StopRequested $input): Decision
    {
        $command = new UnlinkRecordsCommand(new RecordIdentity('tasks.task', '1'), new RecordIdentity('tasks.task', '2'));

        $this->runner->run($command);

        return Decision::delegate();
    }
}
