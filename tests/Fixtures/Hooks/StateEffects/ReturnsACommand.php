<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Records\Commands\UnlinkRecords\UnlinkRecordsCommand;
use App\Records\Support\RecordIdentity;

/**
 * A state that only constructs and returns a command for its caller to run, which the state effects check allows.
 */
final class ReturnsACommand extends AgentState
{
    public function onStop(StopRequested $input): UnlinkRecordsCommand
    {
        return new UnlinkRecordsCommand(new RecordIdentity('tasks.task', '1'), new RecordIdentity('tasks.task', '2'));
    }
}
