<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Support\RecordIdentity;

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
