<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Drivers\RecordRuntime\RecordRuntimeCommand;
use App\Enums\Drivers\DriverOperation;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The owner asks the host to start and to stop recording a runtime.
 */
#[TestsCommand(RecordRuntimeCommand::class)]
final class RecordRuntimeTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    public function test_the_owner_asks_the_host_to_start_and_stop_a_recording(): void
    {
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);

        $start = $this->asOwner(new RecordRuntimeCommand($agentId, $opened->sessionId, 'record-1', false));
        $stop = $this->asOwner(new RecordRuntimeCommand($agentId, $opened->sessionId, 'record-2', true));

        $operations = DriverRequest::query()->whereKey([$start->requestId, $stop->requestId])->orderBy('sequence')
            ->pluck('operation')->all();
        $this->assertSame([DriverOperation::StartRecording, DriverOperation::StopRecording], $operations);
    }
}
